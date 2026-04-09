# Firestore Course Management Queries

## Required manual setup (cannot be done from this local code workspace)

1. In Firebase Console, create the base tenant and admin docs:
- users/{uid} with tenantId
- tenants/{tenantId}
- tenants/{tenantId}/admins/{uid}
2. Deploy Firestore rules:
- firestore.rules
3. Deploy Firestore indexes:
- firestore.indexes.json

4. Optional one-click admin bootstrap from app:
- In tenants/{tenantId}, set allowSelfAdminBootstrap = true
- In the Home checklist panel, click Assign Current User As Admin
- After first admin is assigned, set allowSelfAdminBootstrap = false

If you use Firebase CLI, run:

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## 1) Bootstrap tenant + admin (run once in Firebase Console)

Create:
- `users/{uid}` with `tenantId`
- `tenants/{tenantId}`
- `tenants/{tenantId}/admins/{uid}`

## 2) Seed the initial template from app code

```js
import { seedDemoCourseTemplate } from "@/_services/course-service";

await seedDemoCourseTemplate();
```

## 3) Upload a new course template

```js
import { createOrUpdateCourseTemplate } from "@/_services/course-service";

await createOrUpdateCourseTemplate({
  id: "transaction-document-workflow-template",
  title: "Transaction Document Workflow",
  category: "Compliance",
  level: "Intermediate",
  duration: "3 hours",
  description: "Prepare, route, and submit required transaction forms.",
  status: "draft",
  version: 1,
  steps: [
    {
      id: "doc-prep",
      order: 1,
      title: "Prepare Documents",
      description: "Build a complete package for review.",
      instructions: ["Collect forms", "Validate required fields"],
      defaultSoftwareId: "docusign",
      softwareOptions: [
        {
          id: "docusign",
          name: "DocuSign",
          category: "E-Signature"
        }
      ]
    }
  ],
  quiz: {
    passingPercent: 80,
    questions: [
      {
        id: "q1",
        question: "What is required before sending for signature?",
        options: ["Skip review", "Validate all required fields"],
        correctAnswerIndex: 1
      }
    ]
  }
});
```

## 4) Modify an existing template

```js
import { createOrUpdateCourseTemplate } from "@/_services/course-service";

await createOrUpdateCourseTemplate({
  id: "mls-listing-essentials-template",
  description: "Updated workflow with 2026 compliance checks.",
  version: 2
});
```

## 5) Publish or unpublish a template

```js
import { setCourseTemplatePublishState } from "@/_services/course-service";

await setCourseTemplatePublishState("mls-listing-essentials-template", true); // publish
await setCourseTemplatePublishState("mls-listing-essentials-template", false); // back to draft
```

## 6) Delete a template

```js
import { removeCourseTemplate } from "@/_services/course-service";

await removeCourseTemplate("old-template-id");
```

## 7) Query tenant templates (admin)

```js
import { listAllCourseTemplatesForTenant } from "@/_services/course-service";

const templates = await listAllCourseTemplatesForTenant();
console.log(templates);
```

## 8) Query learner-facing published templates

```js
import { listPublishedCourseTemplates } from "@/_services/course-service";

const templates = await listPublishedCourseTemplates();
console.log(templates);
```

## 9) Query learner enrollments/progress for dashboard

```js
import { listUserEnrollmentsWithTemplates } from "@/_services/course-service";

const enrollments = await listUserEnrollmentsWithTemplates();
console.log(enrollments);
```
