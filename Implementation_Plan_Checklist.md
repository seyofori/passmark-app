# Implementation Plan Checklist

This checklist provides a detailed step-by-step plan for implementing the Daily Math Exam Prep App based on the MVP plan and UI designs.

---

## 1. Setup and Initialization

### Tasks

- [x] Initialize the React Native project using Expo.
- [x] Set up Firebase backend services:
  - [x] Firestore for data storage.
  - [x] Firebase Authentication for user accounts.
  - [x] Firebase Storage for solution images.
  - [ ] Firebase AI Logic integration grading and streak calculations.
- [x] Install required dependencies:
  - [x] Firebase SDK.
  - [x] Expo Camera and Image Picker.
  - [x] TanStack Query for data fetching/caching.

---

## 1A. User Initialization & Auth

### Tasks

- [ ] On app start, check AsyncStorage for existing user info.
- [ ] If not found, generate a new user object (with unique id, etc.) and store in AsyncStorage.
- [ ] Use this user info for all navigation and data fetching.
- [ ] Sign in the user anonymously with Firebase Auth on app start (if not already signed in).
- [ ] (Later: migrate user info to Firestore for persistence across devices.)

---

## 2. Home Screen

### Tasks

- [x] Design the header:
  - [x] Add the app title " ✅ Passmark".
  - [x] Display the streak badge (e.g., "🔥 5-day streak").
- [x] Implement the daily question card:
  - [x] Fetch the question from Firestore (via TanStack Query).
  - [x] Style the question text/image.
- [x] Add the countdown timer:
  - [x] Calculate remaining time based on the question’s date.
  - [x] Style the timer with hours, minutes, and seconds.
- [x] Add navigation buttons:
  - [x] "Submit Solution" button.
  - [x] "View History" button.

---

## 3. Solution Submission Screen

### Tasks

- [ ] Design the header:
  - [ ] Add the title "Submit Your Solution".
- [ ] Implement image input:
  - [ ] Add "Take Photo" button using Expo Camera.
  - [ ] Add "Upload from Gallery" button using Expo Image Picker.
  - [ ] Preview uploaded images with delete functionality.
- [ ] Add the submit button:
  - [ ] Style the button prominently.
  - [ ] Connect the button to Firebase Functions for grading.
- [ ] Add retry option:
  - [ ] Implement "Clear and re-upload images" functionality.

---

## 4. History Screen

### Tasks

- [x] Design the header:
  - [x] Add the title "Your History".
- [x] Implement the list view:
  - [x] Fetch solved questions and grades from Firestore (via TanStack Query).
  - [x] Style rows with alternating colors.
  - [x] Add thumbnails, grade badges, and dates.
- [x] Add tappable rows:
  - [x] Open detailed view for each question.
  - [x] Display full question text/image, solution images, and feedback.

---

## 5. Grading Result Screen

### Tasks

- [x] Design the header:
  - [x] Add the title "Your Result".
- [x] Implement grade display:
  - [x] Style the grade prominently (e.g., "85/100").
  - [x] Add motivational text (e.g., "Great Job!").
- [x] Add feedback section:
  - [x] Fetch AI-generated feedback from Firebase Functions.
  - [x] Style the feedback as a card.
- [x] Add retry button:
  - [x] Style the button with a refresh icon.
  - [x] Connect the button to allow resubmission.

---

## 6. Profile/Settings Screen (Skipped)

### Tasks

- [ ] Design the header:
  - [ ] Add the title "Profile & Settings".
- [ ] Implement profile section:
  - [ ] Display user name and streak.
  - [ ] Add optional profile picture.
- [ ] Add settings section:
  - [ ] Implement toggle for notifications.
  - [ ] Implement theme selector (light/dark mode).
- [ ] Add logout button:
  - [ ] Style the button with an intuitive icon.
  - [ ] Connect the button to Firebase Authentication.

---

## 7. Backend Implementation

### Tasks

- [x] Set up Firestore collections:
  - [x] `Users` collection with fields: `userId`, `streak`, `history`, `profilePicture`.
  - [x] `Questions` collection with fields: `questionId`, `content`, `date`, `difficulty`.
  - [x] `Submissions` collection with fields: `submissionId`, `userId`, `questionId`, `images`, `grade`, `feedback`, `timestamp`.
- [ ] Implement Firebase AI Logic integration:
  - [ ] AI grading logic.
  - [ ] Streak calculation logic.
  - [ ] Feedback generation.

---

## 8. Routing & Params Integration

### Tasks

- [ ] Audit all screens for required navigation params (e.g., userId, questionId, resultId).
- [ ] Update all navigation calls (router.push, etc.) to include required params.
- [ ] Update all screen components to read and validate params using `useLocalSearchParams` or equivalent.
- [ ] Add fallback UI for missing/invalid params.
- [ ] Update Maestro and E2E tests to include navigation with params.
- [ ] Document navigation patterns and required params in the README.
- [ ] Test all navigation flows manually and via Maestro.

---

## 9. Testing and Deployment

### Tasks

- [ ] Test each screen for functionality and responsiveness.
- [ ] Test Firebase integration:
  - [ ] Ensure data is stored and retrieved correctly.
  - [ ] Verify AI grading and feedback.
- [ ] Refine UI/UX based on feedback.
- [ ] Deploy the app to app stores:
  - [ ] Google Play Store.
  - [ ] Apple App Store.

---

## Stretch Features

### Tasks

- [ ] Implement leaderboard:
  - [ ] Fetch top streaks from Firestore.
  - [ ] Style the leaderboard screen.
- [ ] Add hints for difficult questions:
  - [ ] Store hints in Firestore.
  - [ ] Display hints on the daily question screen.
- [ ] Allow teachers to upload custom questions:
  - [ ] Create admin interface for question uploads.
  - [ ] Store custom questions in Firestore.

---

This checklist ensures a structured and detailed approach to implementing the app, covering both frontend and backend tasks.

