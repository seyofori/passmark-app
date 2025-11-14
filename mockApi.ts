// mockApi.ts
// Mock API functions for TanStack Query integration

export async function fetchDailyQuestion() {
  await new Promise((res) => setTimeout(res, 800)) // Simulate network delay
  return {
    id: "q1",
    question:
      "If a rectangle has a perimeter of 36 units and its length is twice its width, what is the area of the rectangle in square units?",
    streak: 5,
  }
}

export async function fetchHistory() {
  await new Promise((res) => setTimeout(res, 800))
  return [
    { id: "1", title: "Integral of x^2", date: "Oct 26, 2023", grade: 92 },
    {
      id: "2",
      title: "Find the derivative o...",
      date: "Oct 25, 2023",
      grade: 75,
    },
    {
      id: "3",
      title: "Solve for x in 2x + 5 ...",
      date: "Oct 24, 2023",
      grade: 45,
    },
    {
      id: "4",
      title: "Calculate the area ...",
      date: "Oct 23, 2023",
      grade: 100,
    },
  ]
}

export async function fetchHistoryDetail(id: string) {
  await new Promise((res) => setTimeout(res, 800))
  return {
    id,
    date: "Oct 26, 2023",
    question:
      "Solve the following integral: ∫(3x^2 + 2x - 5) dx. Show all steps of your calculation and provide the final simplified answer.",
    images: [],
    grade: 85,
    feedback: [
      {
        type: "success",
        title: "Correct Application of Power Rule",
        text: "You correctly applied the power rule for integration to the 3x² and 2x terms.",
      },
      {
        type: "success",
        title: "Constant of Integration",
        text: 'Great job remembering to add the constant of integration, "+ C". This is a crucial step!',
      },
      {
        type: "error",
        title: "Minor Calculation Error",
        text: 'There seems to be a small error in the integration of the constant term (-5). Remember that the integral of a constant "k" is "kx".',
      },
    ],
  }
}

export async function fetchGradingResult() {
  await new Promise((res) => setTimeout(res, 800))
  return {
    score: 85,
    message: "Great Job!",
    analysis:
      "You excelled in Algebra but should review Geometry concepts like calculating the area of irregular shapes. Practice more problems involving theorems.",
  }
}
