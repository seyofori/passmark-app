# TanStack Query Integration Plan

This document outlines the step-by-step plan to integrate TanStack Query (React Query) with mocked data, and to add loading, error, and pull-to-refresh states for each relevant page in the app.

---

## 1. Setup

- [x] Install TanStack Query:
  ```sh
  npm install @tanstack/react-query
  ```
- [x] Set up the `QueryClient` and `QueryClientProvider` at the root of your app (e.g., in `_layout.tsx`).
- [x] Create a `mockApi.ts` file in your project to hold mock API functions for fetching data.

---

## 2. Home Screen (Next Step)

1. **Replace Hardcoded Data**
   - Create a mock API function to fetch the daily question and streak. **(done in mockApi.ts)**
   - [x] Use `useQuery` to fetch this data.
2. **Loading State**
   - [x] Show a loading spinner or skeleton while fetching.
3. **Error State**
   - [x] Display an error message and a retry button if fetching fails.
4. **Pull to Refresh**
   - [x] Add pull-to-refresh using a `RefreshControl` on the main `ScrollView` or `FlatList`.
   - [x] Use `refetch` from `useQuery` to refresh data.

---

---

## 3. History Screen (Next Step)

1. **Replace Hardcoded Data**
   - Create a mock API function to fetch the user’s history. **(done in mockApi.ts)**
   - [x] Use `useQuery` to fetch history data.
2. **Loading State**
   - [x] Show a loading spinner or skeleton for the list.
3. **Error State**
   - [x] Display an error message and a retry button if fetching fails.
4. **Pull to Refresh**
   - [x] Add pull-to-refresh to the `FlatList` using `RefreshControl`.
   - [x] Use `refetch` from `useQuery` to refresh history.

---

---

## 4. History Detail Screen (Next Step)

1. **Replace Hardcoded Data**
   - Create a mock API function to fetch details for a specific question by ID. **(done in mockApi.ts)**
   - [x] Use `useQuery` with the question ID.
2. **Loading State**
   - [x] Show a loading spinner or skeleton for the detail view.
3. **Error State**
   - [x] Display an error message and a retry button if fetching fails.
4. **Pull to Refresh**
   - [x] Add pull-to-refresh to the `ScrollView`.
   - [x] Use `refetch` from `useQuery` to refresh the detail.

---

---

## 5. Grading Result Screen (Next Step)

1. **Replace Hardcoded Data**
   - Create a mock API function to fetch grading results. **(done in mockApi.ts)**
   - [x] Use `useQuery` to fetch the result.
2. **Loading State**
   - [x] Show a loading spinner or skeleton for the result.
3. **Error State**
   - [x] Display an error message and a retry button if fetching fails.
4. **Pull to Refresh**
   - [x] Add pull-to-refresh to the `ScrollView` to re-fetch the grading result.

---

---

## 7. General

- [ ] Ensure all queries use unique keys.
- [ ] Use `isLoading`, `isError`, and `refetch` from `useQuery` for state management.
- [x] Mock API functions should simulate network delay and possible errors for realistic testing.

---

This plan will help ensure a robust, user-friendly experience with reliable data fetching and error handling throughout the app.

