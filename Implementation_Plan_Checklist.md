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

- [x] On app start, check AsyncStorage for existing user info.
- [x] If not found, generate a new user object (with unique id, etc.) and store in AsyncStorage.
- [x] Use this user info for all navigation and data fetching.
- [x] Sign in the user anonymously with Firebase Auth on app start (if not already signed in).
- [x] Handle corrupted/invalid AsyncStorage user data gracefully (auto-recover).
- [ ] (Later: migrate user info to Firestore for persistence across devices.)

---

## 1B. Screen Refactors

- [x] Home Screen: TanStack Query, real API
- [x] History Screen: TanStack Query, real API
- [x] History Detail Screen: TanStack Query, real API
- [x] Grading Result Screen: TanStack Query, real API, user context

---

## 2. Navigation & User Context

- [x] Replace userId passing in navigation/routes with a UserContext provider
  - Provide user object (from AsyncStorage/Firebase) via React context
  - Refactor all screens/components to consume user from context instead of navigation params
  - Update navigation logic to remove userId from route params
  - Ensure all data fetching hooks use user from context

---

## 3. Next Steps

- [ ] Test navigation between screens to ensure user context works
- [ ] Update deep links, tests, or docs that referenced userId in the route

---

## 3. Home Screen

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

## 4. Solution Submission Screen

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

## 4. Submit-Your-Solution Screen Implementation

- [ ] Show real images on submit screen
  - Display images the user takes or selects, not placeholders, on the submit-your-solution screen.
- [ ] Allow camera and gallery upload
  - Enable user to take a picture or upload from gallery on the submit-your-solution screen. Integrate with Expo ImagePicker and Camera APIs.
- [ ] Submit for AI grading
  - Allow user to submit their solution images for AI grading. Send request to Firebase backend/Cloud Function for grading.
- [ ] Navigate to grading result with question id
  - After grading, navigate to grading-result screen with the question id so user can view their grade/result.

---

## 5. History Screen

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

## 6. Grading Result Screen

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

## 7. Profile/Settings Screen (Skipped)

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

## 8. Backend Implementation

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

