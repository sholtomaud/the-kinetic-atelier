import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 2. Implement DynamoDB Table (KineticAtelierTable)
    const table = new dynamodb.Table(this, 'KineticAtelierTable', {
      tableName: 'KineticAtelierTable',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For dev purposes
    });

    // 3. Implement EventBridge Custom Event Bus
    const eventBus = new events.EventBus(this, 'KineticAtelierEventBus', {
      eventBusName: 'KineticAtelierEventBus'
    });

    // 4. Implement API Gateway (REST API)
    const api = new apigateway.RestApi(this, 'KineticAtelierApi', {
      restApiName: 'KineticAtelierApi',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // IAM Role for API Gateway to put events to EventBridge
    const apiEventBridgeRole = new iam.Role(this, 'ApiEventBridgeRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });
    eventBus.grantPutEventsTo(apiEventBridgeRole);

    // IAM Role for API Gateway to read/write DynamoDB
    const apiDynamoDBRole = new iam.Role(this, 'ApiDynamoDBRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });
    table.grantReadWriteData(apiDynamoDBRole);

    // Workout Endpoints
    const workouts = api.root.addResource('workouts');

    // POST /workouts -> EventBridge PutEvents
    workouts.addMethod('POST', new apigateway.AwsIntegration({
      service: 'events',
      action: 'PutEvents',
      options: {
        credentialsRole: apiEventBridgeRole,
        requestTemplates: {
          'application/json': `{
            "Entries": [
              {
                "Source": "kinetic.atelier",
                "DetailType": "WorkoutLogged",
                "Detail": "$util.escapeJavaScript($input.body)",
                "EventBusName": "${eventBus.eventBusName}"
              }
            ]
          }`,
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': '{"status": "Workout event published"}',
            },
          },
        ],
      },
    }), {
      methodResponses: [{ statusCode: '200' }],
    });

    // Vitals Endpoints
    const vitals = api.root.addResource('vitals');

    // POST /vitals -> EventBridge PutEvents
    vitals.addMethod('POST', new apigateway.AwsIntegration({
      service: 'events',
      action: 'PutEvents',
      options: {
        credentialsRole: apiEventBridgeRole,
        requestTemplates: {
          'application/json': `{
            "Entries": [
              {
                "Source": "kinetic.atelier",
                "DetailType": "VitalsRecorded",
                "Detail": "$util.escapeJavaScript($input.body)",
                "EventBusName": "${eventBus.eventBusName}"
              }
            ]
          }`,
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': '{"status": "Vitals event published"}',
            },
          },
        ],
      },
    }), {
      methodResponses: [{ statusCode: '200' }],
    });

    // GET /vitals -> DynamoDB Query
    vitals.addMethod('GET', new apigateway.AwsIntegration({
      service: 'dynamodb',
      action: 'Query',
      options: {
        credentialsRole: apiDynamoDBRole,
        requestTemplates: {
          'application/json': `{
            "TableName": "${table.tableName}",
            "KeyConditionExpression": "PK = :pk AND begins_with(SK, :sk)",
            "ExpressionAttributeValues": {
              ":pk": { "S": "USER#$input.params('userId')" },
              ":sk": { "S": "VITAL#" }
            }
          }`,
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': `#set($inputRoot = $input.path('$'))
              [
                #foreach($item in $inputRoot.Items)
                {
                  "PK": "$item.PK.S",
                  "SK": "$item.SK.S",
                  "data": $item.data.S
                }#if($foreach.hasNext),#end
                #end
              ]`,
            },
          },
        ],
      },
    }), {
      methodResponses: [{ statusCode: '200' }],
    });

    // GET /workouts -> DynamoDB Query
    workouts.addMethod('GET', new apigateway.AwsIntegration({
      service: 'dynamodb',
      action: 'Query',
      options: {
        credentialsRole: apiDynamoDBRole,
        requestTemplates: {
          'application/json': `{
            "TableName": "${table.tableName}",
            "KeyConditionExpression": "PK = :pk AND begins_with(SK, :sk)",
            "ExpressionAttributeValues": {
              ":pk": { "S": "USER#$input.params('userId')" },
              ":sk": { "S": "WORKOUT#" }
            }
          }`,
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': `#set($inputRoot = $input.path('$'))
              [
                #foreach($item in $inputRoot.Items)
                {
                  "PK": "$item.PK.S",
                  "SK": "$item.SK.S",
                  "data": $item.data.S
                }#if($foreach.hasNext),#end
                #end
              ]`,
            },
          },
        ],
      },
    }), {
      methodResponses: [{ statusCode: '200' }],
    });

    // Routine Endpoints
    const routines = api.root.addResource('routines');

    // POST /routines -> DynamoDB PutItem
    routines.addMethod('POST', new apigateway.AwsIntegration({
      service: 'dynamodb',
      action: 'PutItem',
      options: {
        credentialsRole: apiDynamoDBRole,
        requestTemplates: {
          'application/json': `{
            "TableName": "${table.tableName}",
            "Item": {
              "PK": { "S": "USER#$input.path('$.userId')" },
              "SK": { "S": "ROUTINE#$input.path('$.routineId')" },
              "data": { "S": "$util.escapeJavaScript($input.body)" }
            }
          }`,
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': '{"status": "Routine saved"}',
            },
          },
        ],
      },
    }), {
      methodResponses: [{ statusCode: '200' }],
    });

    // GET /routines -> DynamoDB Query
    routines.addMethod('GET', new apigateway.AwsIntegration({
      service: 'dynamodb',
      action: 'Query',
      options: {
        credentialsRole: apiDynamoDBRole,
        requestTemplates: {
          'application/json': `{
            "TableName": "${table.tableName}",
            "KeyConditionExpression": "PK = :pk AND begins_with(SK, :sk)",
            "ExpressionAttributeValues": {
              ":pk": { "S": "USER#$input.params('userId')" },
              ":sk": { "S": "ROUTINE#" }
            }
          }`,
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': `#set($inputRoot = $input.path('$'))
              [
                #foreach($item in $inputRoot.Items)
                {
                  "PK": "$item.PK.S",
                  "SK": "$item.SK.S",
                  "data": $item.data.S
                }#if($foreach.hasNext),#end
                #end
              ]`,
            },
          },
        ],
      },
    }), {
      methodResponses: [{ statusCode: '200' }],
    });

    // 7. Implement Lambda Functions and Event Rules
    // Analytics Processor Lambda
    const analyticsProcessor = new NodejsFunction(this, 'AnalyticsProcessor', {
      entry: path.join(__dirname, '../lambda/analyticsProcessor.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    table.grantReadWriteData(analyticsProcessor);

    // Rule: WorkoutLogged and VitalsRecorded trigger Analytics Processor
    const analyticsRule = new events.Rule(this, 'AnalyticsRule', {
      eventBus: eventBus,
      eventPattern: {
        source: ['kinetic.atelier'],
        detailType: ['WorkoutLogged', 'VitalsRecorded'],
      },
    });
    analyticsRule.addTarget(new targets.LambdaFunction(analyticsProcessor));

    // AI Insights Engine Lambda
    const aiInsightsEngine = new NodejsFunction(this, 'AIInsightsEngine', {
      entry: path.join(__dirname, '../lambda/aiInsightsEngine.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: table.tableName,
        // GEMINI_API_KEY: ... (should be in Secrets Manager)
      },
    });
    table.grantReadWriteData(aiInsightsEngine);

    // Rule: Daily AI Insights Trigger (can also be event triggered)
    const dailyInsightsRule = new events.Rule(this, 'DailyInsightsRule', {
      schedule: events.Schedule.expression('rate(1 day)'),
    });
    dailyInsightsRule.addTarget(new targets.LambdaFunction(aiInsightsEngine));

    // Simple API Key Secret (Placeholder for Gemini API Key)
    const geminiSecret = new cdk.aws_secretsmanager.Secret(this, 'GeminiApiKey', {
      secretName: 'KineticAtelier/GeminiApiKey',
      description: 'API Key for Gemini AI Insights',
    });
    geminiSecret.grantRead(aiInsightsEngine);

    // 8. Implement Static Hosting (S3 + CloudFront)
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });

    const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: distribution.distributionDomainName,
    });
  }
}
