
# 🧠 Serverless Feedback Analyzer (with Screenshot Upload, AI Sentiment & Admin Panel)

A modern serverless application built using AWS services, React, Clerk for authentication, and Stream Video SDK for real-time communication. The system collects user feedback along with optional screenshots, analyzes sentiment using Comprehend, stores data in DynamoDB, and alerts admins via email if the sentiment is negative.

---

## 🏗️ Architecture Overview

```mermaid
graph TD
  A[React Frontend (Next.js)]
  A -->|Clerk Auth| B((Clerk))
  A -->|Video Calls| C((Stream Video SDK))
  A -->|GET /upload-url| D[UploadURLHandler (Lambda)]
  A -->|POST /feedback| E[FeedbackHandler (Lambda)]
  E -->|Sentiment & KeyPhrases| F[Amazon Comprehend]
  E -->|Store S3 URL & Text| G[DynamoDB]
  E -->|If NEGATIVE| H[SNS Topic: FeedbackTopic]
  H --> I[AlertQueue (SQS)]
  I --> J[SendAlertWorker (Lambda)]
  J --> K[SES: Send Admin Email]
  H --> L[StoreToDBWorker (Lambda)]
  L --> G
  D --> M[S3 (Pre-signed Upload)]
  A --> G
```

---

## 🔐 Authentication & Video Integration

### Clerk (User Authentication)
- **Clerk** is used for secure login, session handling, and access control.
- Only logged-in users can submit feedback or access the admin dashboard.

### Stream Video SDK (Video Conferencing)
- Enables high-quality real-time video calls.
- Fully integrated into the app alongside Clerk.

---

## ⚙️ Lambda Functions

### 1. `UploadURLHandler`
- Generates a presigned S3 URL for secure screenshot upload.

### 2. `FeedbackHandler`
- Accepts user feedback + screenshotKey.
- Uses AWS Comprehend to detect sentiment and key phrases.
- Stores result in DynamoDB.
- If sentiment is **NEGATIVE**, publishes alert to SNS.

### 3. `SendAlertWorker`
- Subscribed to AlertQueue (SQS).
- Sends alert email to admin via SES when triggered.

### 4. `StoreToDBWorker`
- Also subscribed to SNS (fan-out model).
- Stores feedback permanently in DynamoDB.

---

## 🧾 Technologies Used

- Frontend: **React (Next.js)** + **TailwindCSS** + **Axios**
- Auth: **Clerk**
- Video Calls: **Stream Video SDK**
- Backend: **AWS Lambda**, **API Gateway**, **DynamoDB**, **S3**, **SNS**, **SQS**, **SES**, **Comprehend**

---

## 🖥️ Admin Dashboard

- Displays feedback text, sentiment, timestamp, and screenshot preview.
- Auto-updated via API call to `GET /admin-feedbacks`.

---

## 📁 Project Structure (Lambda)

```
/lambdas
├── FeedbackHandler/
├── SendAlertWorker/
├── StoreToDBWorker/
├── UploadURLHandler/
```

---

## 🚀 Deployment Steps

1. Deploy Lambdas via AWS Console or CDK.
2. Create DynamoDB table: `FeedbackTable`
3. Create S3 Bucket: `video-feedback-screenshots`
4. Set up SNS topic and two SQS queues.
5. Connect frontend with Clerk + Stream.
6. Deploy frontend on Vercel or Netlify.

---

## 📬 Example Screenshot Feedback

<img src="https://video-feedback-screenshots.s3.amazonaws.com/example.png" width="400" />

---

## 🙌 Author
Built by Himesh Tyagi — DevOps & Cloud Enthusiast
