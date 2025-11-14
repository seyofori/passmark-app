# Implementation Plan Checklist

This checklist provides a detailed step-by-step plan for implementing the Daily Math Exam Prep App based on the MVP plan and UI designs.

---

## 1. Setup and Initialization

### Tasks

- [x] Initialize the React Native project using Expo.
- [ ] Set up Firebase backend services:
  - [ ] Firestore for data storage.
  - [ ] Firebase Authentication for user accounts.
  - [ ] Firebase Storage for solution images.
  - [ ] Firebase AI Logic integration grading and streak calculations.
- [ ] Install required dependencies:
  - [ ] Firebase SDK.
  - [ ] Expo Camera and Image Picker.

---

## 2. Home Screen

### Tasks

- [ ] Design the header:
  - [ ] Add the app title " ✅ Passmark".
  - [ ] Display the streak badge (e.g., "🔥 5-day streak").
- [ ] Implement the daily question card:
  - [ ] Fetch the question from Firestore.
  - [ ] Style the question text/image.
- [ ] Add the countdown timer:
  - [ ] Calculate remaining time based on the question’s date.
  - [ ] Style the timer with hours, minutes, and seconds.
- [ ] Add navigation buttons:
  - [ ] "Submit Solution" button.
  - [ ] "View History" button.

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

- [ ] Design the header:
  - [ ] Add the title "Your History".
- [ ] Implement the list view:
  - [ ] Fetch solved questions and grades from Firestore.
  - [ ] Style rows with alternating colors.
  - [ ] Add thumbnails, grade badges, and dates.
- [ ] Add tappable rows:
  - [ ] Open detailed view for each question.
  - [ ] Display full question text/image, solution images, and feedback.

---

## 5. Grading Result Screen

### Tasks

- [ ] Design the header:
  - [ ] Add the title "Your Result".
- [ ] Implement grade display:
  - [ ] Style the grade prominently (e.g., "85/100").
  - [ ] Add motivational text (e.g., "Great Job!").
- [ ] Add feedback section:
  - [ ] Fetch AI-generated feedback from Firebase Functions.
  - [ ] Style the feedback as a card.
- [ ] Add retry button:
  - [ ] Style the button with a refresh icon.
  - [ ] Connect the button to allow resubmission.

---

## 6. Profile/Settings Screen

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

- [ ] Set up Firestore collections:
  - [ ] `Users` collection with fields: `userId`, `streak`, `history`, `profilePicture`.
  - [ ] `Questions` collection with fields: `questionId`, `content`, `date`, `difficulty`.
  - [ ] `Submissions` collection with fields: `submissionId`, `userId`, `questionId`, `images`, `grade`, `feedback`, `timestamp`.
- [ ] Implement Firebase AI Logic integration:
  - [ ] AI grading logic.
  - [ ] Streak calculation logic.
  - [ ] Feedback generation.

---

## 8. Testing and Deployment

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
