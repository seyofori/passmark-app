# MVP Plan: Daily Math Exam Prep App

## Objective

To create a simple app that helps students prepare for their upcoming math exams by providing a daily question to solve, grading their solutions using AI, and tracking their progress.

---

## Core Features

### 1. Daily Question

- **Functionality**: Display a new math question every day.
- **Time Limit**: Students have 24 hours to solve and submit their solution.
- **Backend**: Firebase will manage the daily question distribution and enforce the 24-hour submission window.

### 2. Solution Submission

- **Functionality**: Allow students to take one or more pictures of their solution and submit them.
- **AI Grading**: Use AI to grade the solution and provide a score out of 100.
- **Retry Option**: Students can submit multiple attempts within the 24-hour window.

### 3. Previous Questions and Grades

- **Functionality**: Students can view a history of the questions they solved and their grades.
- **Data Storage**: Firebase will store the question, solution images, and grades for each user.

### 4. Streak Feature

- **Functionality**: Track the number of consecutive days a student has successfully attempted a question.
- **Reset Mechanism**: If a day is missed, the streak resets to zero.
- **UI**: Display the current streak prominently in the app.

---

## Updated Features Based on UI Designs

### 1. Daily Question

- **UI Enhancements**:
  - Display the streak prominently as a badge (e.g., "🔥 5-day streak") in the header.
  - Include a countdown timer styled with hours, minutes, and seconds.
  - Question card with bold typography and centered alignment.

### 2. Solution Submission

- **UI Enhancements**:
  - Two buttons for image input: "Take Photo" and "Upload from Gallery".
  - Preview section for uploaded images with delete functionality.
  - Submit button styled prominently at the bottom.
  - Retry option as a text link below the submit button.

### 3. Previous Questions and Grades

- **UI Enhancements**:
  - List view with alternating row colors for clarity.
  - Each row includes a thumbnail, grade badge (e.g., "85/100"), and date.
  - Tapable rows to view detailed question and solution.

### 4. Grading Result Screen

- **UI Enhancements**:
  - Large, centered grade display (e.g., "85/100") with motivational text (e.g., "Great Job!").
  - AI-generated feedback section styled as a card.
  - Retry button with refresh icon.

### 5. Profile/Settings Screen

- **UI Enhancements**:
  - Display user name and streak prominently.
  - Include toggles for notifications and theme selection.
  - Logout button styled with an intuitive icon.

---

## Technical Details

### Frontend

- **Framework**: React Native (Expo)
- **UI Components**:
  - Daily Question Screen
  - Solution Submission Screen
  - History Screen
  - Streak Tracker

### Backend

- **Platform**: Firebase
- **Services**:
  - Firestore: Store user data, questions, solutions, and grades.
  - Firebase Functions: Handle AI grading logic and streak calculations.
  - Firebase Authentication: Manage user accounts.
  - Firebase Storage: Store solution images.

### AI Grading

- **Approach**: Integrate a pre-trained AI model for math solution grading.
- **Execution**: Firebase Functions will process the images and return a score.

---

## Updated Firebase Schema

### Collections

1. **Users**

   - `userId`: Unique ID
   - `streak`: Current streak count
   - `history`: Array of solved questions with grades
   - `profilePicture`: URL of the user’s profile picture (optional).

2. **Questions**

   - `questionId`: Unique ID
   - `content`: Question text/image
   - `date`: Date of the question
   - `difficulty`: Difficulty level of the question (optional).

3. **Submissions**
   - `submissionId`: Unique ID
   - `userId`: ID of the user
   - `questionId`: ID of the question
   - `images`: Array of solution image URLs
   - `grade`: Score out of 100
   - `feedback`: AI-generated feedback text
   - `timestamp`: Submission time

---

## User Flow

1. **Daily Question**:

   - User opens the app and sees the daily question.
   - Timer shows the remaining time to submit a solution.

2. **Solution Submission**:

   - User takes pictures of their solution and submits them.
   - AI grades the solution and displays the score.
   - User can retry within the 24-hour window.

3. **History**:

   - User navigates to the history screen to view past questions and grades.

4. **Streak Tracker**:
   - User sees their current streak on the home screen.
   - Streak resets if a day is missed.

---

## Stretch Features

- **Leaderboard**: Show top streaks among users.
- **Hints**: Provide hints for difficult questions.
- **Custom Questions**: Allow teachers to upload custom questions for their students.

---

## Timeline

### Week 1: Planning and Setup

- Define app structure and Firebase schema.
- Set up Firebase backend and integrate with the app.

### Week 2: Core Features

- Implement daily question functionality.
- Build solution submission and AI grading.
- Develop history and streak tracking features.

### Week 3: Testing and Refinement

- Test core features thoroughly.
- Refine UI/UX based on feedback.

### Week 4: Deployment

- Finalize app and deploy to app stores.
- Monitor and fix any post-launch issues.

---

## Conclusion

This MVP focuses on simplicity and core functionality to help students prepare for their math exams effectively. Future iterations can expand on features and improve the AI grading system.

