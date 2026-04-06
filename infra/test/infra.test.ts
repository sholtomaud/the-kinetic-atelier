import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as Infra from '../lib/infra-stack';

test('DynamoDB Table Created with Correct Keys', () => {
  const app = new cdk.App();
  const stack = new Infra.InfraStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::DynamoDB::Table', {
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    TableName: 'KineticAtelierTable'
  });
});

test('Static Hosting Resources Created', () => {
  const app = new cdk.App();
  const stack = new Infra.InfraStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::CloudFront::Distribution', 1);
});

test('Lambda Functions and EventBridge Rules Created', () => {
  const app = new cdk.App();
  const stack = new Infra.InfraStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  // Check Analytics Processor Lambda
  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
    Runtime: 'nodejs18.x',
    Environment: {
      Variables: {
        TABLE_NAME: { Ref: Match.stringLikeRegexp('KineticAtelierTable.*') }
      }
    }
  });

  // Check AI Insights Engine Lambda
  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
    Runtime: 'nodejs18.x',
    Environment: {
      Variables: {
        TABLE_NAME: { Ref: Match.stringLikeRegexp('KineticAtelierTable.*') }
      }
    }
  });

  // Check EventBridge Rule for Analytics
  template.hasResourceProperties('AWS::Events::Rule', {
    EventPattern: {
      source: ['kinetic.atelier'],
      'detail-type': ['WorkoutLogged', 'VitalsRecorded']
    },
    State: 'ENABLED'
  });

  // Check EventBridge Rule for Daily Insights
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 day)',
    State: 'ENABLED'
  });
});

test('API Gateway Created with Routine Endpoints', () => {
  const app = new cdk.App();
  const stack = new Infra.InfraStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::Resource', {
    PathPart: 'routines'
  });

  // Check POST /routines
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'POST',
    ResourceId: { Ref: Match.stringLikeRegexp('KineticAtelierApiroutines.*') },
    Integration: {
      Type: 'AWS',
      IntegrationHttpMethod: 'POST',
      Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':dynamodb:action/PutItem']] }
    }
  });

  // Check GET /routines
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'GET',
    ResourceId: { Ref: Match.stringLikeRegexp('KineticAtelierApiroutines.*') },
    Integration: {
      Type: 'AWS',
      IntegrationHttpMethod: 'POST',
      Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':dynamodb:action/Query']] }
    }
  });
});

test('EventBridge Custom Event Bus Created', () => {
  const app = new cdk.App();
  const stack = new Infra.InfraStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Events::EventBus', {
    Name: 'KineticAtelierEventBus'
  });
});

test('API Gateway Created with Workout Endpoints', () => {
  const app = new cdk.App();
  const stack = new Infra.InfraStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'KineticAtelierApi'
  });

  template.hasResourceProperties('AWS::ApiGateway::Resource', {
    PathPart: 'workouts'
  });

  // Check POST /workouts
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'POST',
    ResourceId: { Ref: Match.stringLikeRegexp('KineticAtelierApiworkouts.*') },
    Integration: {
      Type: 'AWS',
      IntegrationHttpMethod: 'POST',
      Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':events:action/PutEvents']] }
    }
  });

  // Check GET /workouts
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'GET',
    ResourceId: { Ref: Match.stringLikeRegexp('KineticAtelierApiworkouts.*') },
    Integration: {
      Type: 'AWS',
      IntegrationHttpMethod: 'POST',
      Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':dynamodb:action/Query']] }
    }
  });
});

test('API Gateway Created with Vitals Endpoints', () => {
  const app = new cdk.App();
  const stack = new Infra.InfraStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::Resource', {
    PathPart: 'vitals'
  });

  // Check POST /vitals
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'POST',
    ResourceId: { Ref: Match.stringLikeRegexp('KineticAtelierApivitals.*') },
    Integration: {
      Type: 'AWS',
      IntegrationHttpMethod: 'POST',
      Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':events:action/PutEvents']] }
    }
  });

  // Check GET /vitals
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'GET',
    ResourceId: { Ref: Match.stringLikeRegexp('KineticAtelierApivitals.*') },
    Integration: {
      Type: 'AWS',
      IntegrationHttpMethod: 'POST',
      Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':dynamodb:action/Query']] }
    }
  });
});
