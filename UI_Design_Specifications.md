# UI Design Specifications: Daily Math Exam Prep App

This document provides detailed design specifications for the app screens to ensure consistency and clarity when sharing with a design AI or a designer.

---

## 1. Home Screen

### Purpose

To display the daily question, streak information, and provide navigation to other parts of the app.

### Layout

- **Header**:
  - Title: "Daily Math Challenge"
  - Streak Tracker: A badge or icon showing the current streak (e.g., "🔥 5-day streak").
- **Daily Question Card**:
  - Centered card with the question text or image.
  - Countdown Timer: Below the question, showing time left (e.g., "23:45:12 remaining").
- **Navigation Buttons**:
  - Button 1: "Submit Solution" (Primary button style).
  - Button 2: "View History" (Secondary button style).

### Style

- **Color Scheme**: Light background (e.g., #F9FAFB), with primary colors (e.g., #4CAF50 for success, #FF5722 for streaks).
- **Typography**: Bold and large for the question title, medium for the timer.
- **Icons**: Use intuitive icons for streaks and navigation.

---

## 2. Solution Submission Screen

### Purpose

To allow students to upload pictures of their solution and submit them for grading.

### Layout

- **Header**:
  - Title: "Submit Your Solution"
- **Image Upload Section**:
  - Camera Icon: Large button to take a picture.
  - Upload Icon: Large button to upload from the gallery.
  - Preview Area: Thumbnails of uploaded images in a horizontal scrollable view.
- **Submit Button**:
  - Prominent button at the bottom: "Submit for Grading".
- **Retry Option**:
  - Small text link below the submit button: "Clear and re-upload images".

### Style

- **Color Scheme**: White background with accent colors for buttons (e.g., #2196F3 for primary actions).
- **Typography**: Clear and readable, with emphasis on action buttons.
- **Icons**: Use a camera icon for taking pictures and an upload icon for gallery uploads.

---

## 3. History Screen

### Purpose

To show past questions and grades.

### Layout

- **Header**:
  - Title: "Your History"
- **List of Questions**:
  - Each item includes:
    - Thumbnail of the question (small image or text preview).
    - Grade: Displayed as a badge (e.g., "85/100").
    - Date: Small text below the thumbnail.
  - Tapable: Clicking an item opens the detailed view.
- **Detail View**:
  - Full question text/image.
  - Submitted solution images.
  - Grade and feedback.

### Style

- **Color Scheme**: Alternating row colors for the list (e.g., #FFFFFF and #F1F1F1).
- **Typography**: Medium size for list items, smaller for dates.
- **Icons**: Use a chevron icon (>) to indicate tapable rows.

---

## 4. Grading Result Screen

### Purpose

To display the grade after submission.

### Layout

- **Header**:
  - Title: "Your Grade"
- **Grade Display**:
  - Large and centered (e.g., "85/100").
- **Feedback Section**:
  - AI-generated feedback text below the grade.
- **Retry Button**:
  - Prominent button: "Try Again".

### Style

- **Color Scheme**: Success colors for high grades (e.g., green), warning colors for low grades (e.g., orange).
- **Typography**: Large and bold for the grade, smaller for feedback.
- **Icons**: Use a refresh icon for the retry button.

---

## 5. Profile/Settings Screen

### Purpose

To manage user account and app settings.

### Layout

- **Header**:
  - Title: "Profile & Settings"
- **Profile Section**:
  - Display user name and profile picture.
  - Current streak: "🔥 5-day streak".
- **Settings Section**:
  - Toggle for notifications.
  - Theme selector (light/dark mode).
  - Logout button.

### Style

- **Color Scheme**: Neutral background (e.g., #E0E0E0) with accent colors for toggles and buttons.
- **Typography**: Clear and readable, with emphasis on section headers.
- **Icons**: Use standard icons for settings (e.g., bell for notifications, sun/moon for theme).

---

## General Design Guidelines

### Color Palette

- **Primary**: #4CAF50 (Green)
- **Secondary**: #2196F3 (Blue)
- **Accent**: #FF5722 (Orange)
- **Background**: #F9FAFB (Light Gray)
- **Text**: #212121 (Dark Gray)

### Typography

- **Font**: Roboto or Open Sans
- **Sizes**:
  - Large: 24px (Headers)
  - Medium: 18px (Subheaders)
  - Small: 14px (Body Text)

### Buttons

- Rounded corners (8px radius).
- Primary buttons: Solid fill with white text.
- Secondary buttons: Outlined with primary color text.

### Icons

- Use Material Design icons for consistency.
- Ensure icons are intuitive and match their actions.

---

This detailed specification should provide the design AI with all the necessary information to generate screens that align with the app's goals and user experience.
