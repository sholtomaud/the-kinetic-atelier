# Kinetic Atelier - Cloud Infrastructure Requirements

This document outlines the infrastructure and functional requirements for hosting **The Kinetic Atelier** on AWS. The architecture follows an event-driven pattern inspired by the *Serverlesspresso* model, emphasizing direct service integrations through API Gateway VTL and EventBridge to minimize Lambda usage.

## 1. Core Principles
- **TDD (Test-Driven Development)**: Infrastructure as Code (IaC) must be developed using TDD. CDK unit tests (using `aws-cdk-lib/assertions`) must precede or accompany resource definition.
- **AWS CDK**: All infrastructure is defined using AWS Cloud Development Kit (CDK) in TypeScript.
- **Minimal Lambda Architecture**: Use API Gateway service proxies (VTL) to interact directly with DynamoDB, SQS, and EventBridge where possible.
- **Event-Driven**: All state changes must trigger events on a custom EventBridge event bus for downstream processing (e.g., analytics, notifications).

## 2. Infrastructure Architecture

### A. API Gateway (REST API)
- **Role**: Entry point for the frontend.
- **VTL Integrations**:
  - `POST /workouts`: Direct integration with EventBridge `PutEvents`.
  - `GET /workouts`: Direct integration with DynamoDB `Query`.
  - `POST /vitals`: Direct integration with EventBridge `PutEvents`.
  - `GET /vitals`: Direct integration with DynamoDB `Query`.
  - `POST /routines`: Direct integration with DynamoDB `PutItem`.
  - `GET /routines`: Direct integration with DynamoDB `Scan` or `Query`.

### B. EventBridge (Custom Event Bus)
- **Role**: Central nervous system for all application events.
- **Events**:
  - `WorkoutLogged`: Triggered when a user submits a workout.
  - `VitalsRecorded`: Triggered when weight or body fat is logged.
  - `RoutineSaved`: Triggered when a new routine is created.
  - `GoalAchieved`: Triggered by a background process when metrics meet targets.

### C. DynamoDB (Single Table Design)
- **Role**: Persistent storage.
- **Table Name**: `KineticAtelierTable`
- **Keys**:
  - `PK`: `USER#<userId>`
  - `SK`: `WORKOUT#<timestamp>`, `VITAL#<timestamp>`, `ROUTINE#<routineId>`, `PROFILE#<userId>`

### D. Lambda Functions (Minimal)
- **Analytics Processor**: Listens to `WorkoutLogged` and `VitalsRecorded` events on EventBridge to update aggregates (e.g., weekly volume, average weight).
- **AI Insights Engine**: Scheduled Lambda or event-triggered function to call Gemini API and generate personalized advice, storing the result in DynamoDB.

### E. Static Hosting
- **AWS S3 + CloudFront**: For hosting the compiled Vite application assets.

### F. Authentication (Native AWS Auth)
- **Cognito User Pool**: Identity provider for user registration and sign-in.
  - **Attributes**: Email is the primary sign-in attribute.
  - **Social Auth**: Support for Google as a Social Identity Provider.
  - **Passwordless/Biometrics**: Enable WebAuthn/Passkey support for seamless authentication.
- **Cognito Identity Pool**: Provides temporary AWS credentials for authenticated users.
  - **Role-Based Access**: Authenticated users are granted IAM permissions to invoke the API Gateway.
- **IAM Authorization**: API Gateway methods are protected using `AWS_IAM` authorization. Clients must sign requests using SigV4.

## 3. Functional Requirements

### User & Profile Management
- **Action**: Fetch user profile and goals.
- **Implementation**: API Gateway GET `/profile` -> DynamoDB GetItem.
- **PK/SK**: `PK: USER#<identityId>`, `SK: PROFILE#<identityId>`.
- **Requirement**: Return current weight, goals, and "Pro" status.

### Workout Logging
- **Action**: Log a new workout (sets, reps, weight).
- **Implementation**: API Gateway POST -> EventBridge PutEvents (`WorkoutLogged`).
- **Rule**: A background Lambda (Analytics Processor) consumes `WorkoutLogged` and updates the user's weekly volume in DynamoDB via a `transactWrite`.

### Nutrition & Vitals Tracking
- **Action**: Record daily weight and body fat.
- **Implementation**: API Gateway POST -> EventBridge PutEvents (`VitalsRecorded`).
- **Rule**: Direct VTL mapping from API request to EventBridge event structure.

### Workout Planner & Routines
- **Action**: Save a custom workout routine.
- **Implementation**: API Gateway POST -> DynamoDB PutItem (Direct VTL).
- **Action**: Schedule a routine on the calendar.
- **Implementation**: API Gateway POST -> DynamoDB PutItem (Direct VTL).

### Analytics & Insights
- **Requirement**: Calculate "Weight Loss Velocity" and "Fueling Balance".
- **Implementation**: Aggregate metrics stored in DynamoDB, updated by the Analytics Processor Lambda.
- **Requirement**: Generate daily "Atelier Insights".
- **Implementation**: AI Insights Engine Lambda triggered daily or on-demand.

## 4. TDD Strategy for Infrastructure
1. **Define Test**: Write a CDK assertion test checking for the existence of a DynamoDB table with specific keys.
2. **Implement**: Create the `Table` resource in the CDK stack.
3. **Define Test**: Write a test for API Gateway to ensure the `POST /workouts` method has a `PutEvents` integration with the correct VTL mapping.
4. **Implement**: Configure the `RestApi` resource with `AwsIntegration`.
