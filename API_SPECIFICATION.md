# Kinetic Atelier - API Specification

## 1. Authentication
All API requests must be authenticated using **AWS IAM Authorization (SigV4)**.
Clients must obtain temporary credentials from the Cognito Identity Pool after successful authentication with the Cognito User Pool (or via Social Identity Providers like Google).

### Headers
- `Authorization`: `AWS4-HMAC-SHA256 ...` (Standard SigV4 header)
- `X-Amz-Date`: `<ISO8601-Timestamp>`
- `X-Amz-Security-Token`: `<Session-Token>` (If using temporary credentials)

---

## 2. Endpoints

### A. Profile
#### `GET /profile`
Fetches the user's profile and goals.
- **Authorization**: IAM (Authenticated)
- **Response (200 OK)**:
  ```json
  {
    "userId": "string",
    "name": "string",
    "goals": {
      "weight": number,
      "dailyCalories": number,
      "macros": { "p": number, "c": number, "f": number }
    },
    "isPro": boolean
  }
  ```

---

### B. Workouts
#### `GET /workouts?userId={userId}`
Fetches the workout history for a user.
- **Authorization**: IAM (Authenticated)
- **Response (200 OK)**:
  ```json
  [
    {
      "PK": "USER#<userId>",
      "SK": "WORKOUT#<timestamp>",
      "data": {
        "id": "string",
        "date": "string",
        "title": "string",
        "type": "string",
        "duration": number,
        "volume": number,
        "exercises": [...]
      }
    }
  ]
  ```

#### `POST /workouts`
Logs a new workout.
- **Authorization**: IAM (Authenticated)
- **Request Body**:
  ```json
  {
    "id": "string",
    "date": "string",
    "title": "string",
    "type": "string",
    "duration": number,
    "volume": number,
    "exercises": [...]
  }
  ```
- **Response (200 OK)**: `{"status": "Workout event published"}`

---

### C. Vitals
#### `GET /vitals?userId={userId}`
Fetches the vitals history (weight, body fat).
- **Authorization**: IAM (Authenticated)
- **Response (200 OK)**:
  ```json
  [
    {
      "PK": "USER#<userId>",
      "SK": "VITAL#<timestamp>",
      "data": {
        "date": "string",
        "weight": number,
        "bodyFat": number
      }
    }
  ]
  ```

#### `POST /vitals`
Logs daily vitals.
- **Authorization**: IAM (Authenticated)
- **Request Body**:
  ```json
  {
    "date": "string",
    "weight": number,
    "bodyFat": number
  }
  ```
- **Response (200 OK)**: `{"status": "Vitals event published"}`

---

### D. Routines
#### `GET /routines?userId={userId}`
Fetches saved workout routines.
- **Authorization**: IAM (Authenticated)
- **Response (200 OK)**:
  ```json
  [
    {
      "PK": "USER#<userId>",
      "SK": "ROUTINE#<routineId>",
      "data": {
        "id": "string",
        "name": "string",
        "type": "string",
        "target": "string",
        "duration": number,
        "exercises": ["string"]
      }
    }
  ]
  ```

#### `POST /routines`
Saves a new routine.
- **Authorization**: IAM (Authenticated)
- **Request Body**:
  ```json
  {
    "userId": "string",
    "routineId": "string",
    "name": "string",
    "type": "string",
    "target": "string",
    "duration": number,
    "exercises": ["string"]
  }
  ```
- **Response (200 OK)**: `{"status": "Routine saved"}`
