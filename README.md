Web Development 2 – Project Phase 1
Group: 4
Project Name: real-estate-library
Selected Option: Option D: Learning Management System
GitHub:
GitHub Username: Keith Sharman
Repository Link: https://github.com/KeithSharman/Real-Estate-Library
URL: https://keith-sharman-real-estate-library.vercel.app/
Description:
Problem:
Real estate companies often require new employees to learn complicated workflows involving multiple software systems, legal documents, and regulatory processes. Currently, new employees are trained by shadowing experienced staff members, which can take weeks or months. This approach is expensive, and inefficient for companies.
Tasks might involve: Creating and submitting documents, Listing properties, Managing client records, etc.
Training materials for these processes largely do not exist as these processes often involve multiple pieces of software, and most companies use combinations that differ from each other. The lack of consistency and small market has stopped any one company from investing in a service that would only be relevant to their few employees, and only until they change their combination of software.
Solution
A real estate administrative assistant, filmmaker and I, have decided to partner after the real estate worker has been commissioned to make several instructional videos for their real estate company. This project will build a real estate training platform with courses where employees can learn workflows through modular courses containing videos, lessons, and quizzes.
Courses will be broken into small modules that represent steps in a real estate workflow. The majority of software in use by the industry will start and end its functionality in the same places. After completing one step, the learner selects the next piece of software to use, and progresses to the next step of the course, and process, autonomously from a mentor.
Each step may involve a different piece of software used by the company.
The platform will initially contain placeholder training content (The videos are not done, and this course requires things like quizzes) but it is designed to later integrate real training videos and content.
Target Audience
Primary users include:
•	Real estate companies that want structured onboarding for new employees
•	New real estate agents or assistants learning company workflows
•	Instructors or managers responsible for training staff
Technologies
The application will use the following technologies:
Authentication:
•	Firebase Auth
Database:
•	Firebase Firestore
File Storage: 
•	Firebase Storage
Deployment:
•	Vercel
External APIs:
•	YouTube Data API (for embedding course videos)
•	Payment via Stripe
 
Development Plan

Phase 1
Features:
•	Selecting the project concept (Real Estate Learning Management System)
•	Identifying the target users and problem being solved
•	Planning core features
•	Designing the application architecture (pages, components, API routes, and database models)
•	Creating the initial GitHub repository
•	Deploying a basic Next.js application to Vercel
Phase 2 Sprint 1: Core Features and Data Model
This sprint focuses on building the foundation of the application and defining how data will be stored.
Features:
•	Create main pages (Home, Course Catalog, Course Page, Dashboards, lesson view)
•	Build basic reusable components (Navbar, CourseCard, LessonList)
•	Design and Firestore data models for:
o	Users
o	Courses
o	Lessons
o	Progress tracking
Phase 2 Sprint 2: Authentication, API Routes, and Database Integration
Features:
•	Implement Firebase Authentication
•	Implement Firestore data models
•	Create login and signup pages
•	Implement protected routes for dashboards
•	Integrate the YouTube Data API to embed training videos in lessons
•	Implement Stripe payment
Phase 2 – Sprint 3: UI Polish, External APIs, and Feature Completion
Features:
•	Improve UI design and responsiveness
•	Add progress tracking for completed lessons
•	Implement quizzes and grading
•	Display progress in the student dashboard
•	Add course search or filtering features
Phase 3 – Deployment, Self-Reflection, and Showcase
This phase focuses on finalizing the project and preparing it for submission.
Features:
•	Application deployed
•	All features work correctly
•	Self-reflection written
•	Show in Showcase
 
Architecture
The application will follow a Next.js App Router structure.
Pages
Main pages will include:
Home Page
Landing page that explains the platform and allows users to sign up, log in as a user, or log in as a business owner.
Course Catalog
Displays all available courses with filterable search.
Course Page
Shows course details, i.e lesson list, compatible software/tools.
Lesson Page
Displays lesson content.
Account Dashboard
Shows completed courses and progress tracking for students, and plan for business owners and students.
Sign up page for organizations
Sells the course to organizations and allows them to enroll (individual users are considered organizations of 1)
Payment Page
Allows users to pay for access via Stripe

Components
Reusable UI components will include:
Navbar
Navigation bar for site navigation.
CourseCard
Displays course preview information in the catalog.
LessonList
Displays lessons within a course.
VideoPlayer
Embeds YouTube videos into lessons.
ProgressBar
Displays course completion progress.
QuizComponent
Handles quiz questions and automatic grading.
API Routes
Next.js API routes will handle backend functionality.
Examples include:
/api/courses
Create, fetch, update, or delete courses.
/api/lessons
Manage lesson content within courses.
/api/enrollment
Handle student enrollment in courses.
/api/progress
Store and retrieve lesson completion data.
/api/quiz
Submit quiz answers and return grading results.
/api/Stripe
Payment service handler
Data Models
Data will be stored using Firebase Firestore, which is a NoSQL, document-oriented database. This allows for real-time synchronization and should be sufficient for a storing data related to courses and their information, as well as students. Several examples of collections, documents and their fields follow below. 
Organization
Organization
-id
-name
-email
-plan
-users
Users
User
- id
- name
- email
- role (student or owner)
- CompletedCourses
Courses
Course
- id
- title
- description
- instructorId
- published
- lessons
Process
Lesson
- id
- courseId
- title
- videoUrl
- content
- quizId
Enrollment / Progress
Progress
- userId
- courseId
- completedLessons
- quizScores
- completionStatus
External API Integration
The platform will integrate the YouTube Data API to embed instructional videos within course lessons. This may also allow videos to be stored externally on YouTube’s cloud, which may help alleviate storage concerns. Externally hosted videos may also allow client’s to upload their own videos and courses, but this remains an optional feature for now.
The platform will also integrate The Stripe Payment API to facilitate payment. Stripe was chosen for it’s ease of use and simplicity.
