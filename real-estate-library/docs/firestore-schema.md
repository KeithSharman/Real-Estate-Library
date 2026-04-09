# Firestore Schema

## Setup notes

- Protected routes are guarded by middleware redirect based on auth cookie presence (`firebaseAuth`).
- Firestore security is enforced by rules; middleware is only for UX redirect.
- Tenant and admin docs must be created in Firebase Console before admin CRUD and learner queries can succeed.

## Core collections

### users/{uid}
```json
{
  "tenantId": "tenant-acme",
  "displayName": "Jordan Smith",
  "email": "jordan@acme.com",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

### tenants/{tenantId}
```json
{
  "name": "ACME Realty",
  "createdAt": "serverTimestamp"
}
```

### tenants/{tenantId}/admins/{uid}
```json
{
  "uid": "user_uid",
  "email": "admin@acme.com",
  "createdAt": "serverTimestamp"
}
```

### tenants/{tenantId}/courseTemplates/{courseId}
```json
{
  "id": "mls-listing-essentials-template",
  "tenantId": "tenant-acme",
  "title": "MLS Listing Essentials",
  "description": "Learn the complete process for publishing a listing.",
  "category": "Listings",
  "level": "Beginner",
  "duration": "2.5 hours",
  "status": "published",
  "version": 1,
  "skills": ["MLS Platform", "Compliance"],
  "tags": ["MLS", "Onboarding"],
  "steps": [
    {
      "id": "crm-setup",
      "order": 2,
      "title": "Client Intake in CRM",
      "description": "Capture client profile data and prepare follow-up.",
      "videoUrl": "https://www.youtube.com/watch?v=...",
      "defaultSoftwareId": "salesforce",
      "instructions": [
        "Create a new lead",
        "Fill required profile fields",
        "Schedule follow-up"
      ],
      "softwareOptions": [
        {
          "id": "salesforce",
          "name": "Salesforce CRM",
          "description": "Recommended CRM path",
          "category": "CRM Platforms",
          "isRecommended": true,
          "features": ["Lead tracking", "Task automation"]
        }
      ],
      "resources": [
        {
          "label": "CRM checklist",
          "url": "https://example.com/checklist",
          "type": "link"
        }
      ]
    }
  ],
  "quiz": {
    "passingPercent": 80,
    "questions": [
      {
        "id": "q1",
        "question": "Which software is used to publish a property listing?",
        "options": ["CRM", "MLS", "Accounting"],
        "correctAnswerIndex": 1
      }
    ]
  },
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

### tenants/{tenantId}/enrollments/{userId_courseId}
```json
{
  "tenantId": "tenant-acme",
  "userId": "user_uid",
  "courseId": "mls-listing-essentials-template",
  "status": "in_progress",
  "currentStepId": "crm-setup",
  "currentStepOrder": 2,
  "stepProgress": {
    "crm-setup": {
      "selectedSoftwareId": "salesforce",
      "completedAt": "serverTimestamp",
      "updatedAt": "serverTimestamp"
    }
  },
  "quiz": {
    "passed": false,
    "score": null,
    "lastAttemptAt": null
  },
  "startedAt": "serverTimestamp",
  "updatedAt": "serverTimestamp",
  "completedAt": null
}
```

### tenants/{tenantId}/quizAttempts/{attemptId}
```json
{
  "tenantId": "tenant-acme",
  "userId": "user_uid",
  "courseId": "mls-listing-essentials-template",
  "answersByQuestionId": {
    "q1": 1,
    "q2": 0
  },
  "score": 80,
  "passed": true,
  "passingPercent": 80,
  "submittedAt": "serverTimestamp"
}
```

## Demo template seed

The initial demo content is now represented as `DEMO_COURSE_TEMPLATE_SEED` in [_services/course-service.js](_services/course-service.js).
Use `seedDemoCourseTemplate()` after adding your admin membership doc.
