# Lumina Feedback Dashboard
---

## Features

### Feedback List

Customer feedback is displayed in a responsive card grid. Each card includes the customer name, initials, feedback date, sentiment badge, and full feedback text.

### Search Bar

The search bar filters feedback as the user types. It searches across both the customer name and feedback text.

### Sentiment Filtering

Users can filter the list by:

- All Feedback
- Positive
- Neutral
- Negative

Search and sentiment filtering work together, so users can narrow results by both text and sentiment at the same time.

### Sentiment Trend Chart

The dashboard includes a chart for tracking feedback trends over time.

Users can:

- Toggle between Positive, Neutral, and Negative feedback
- Group chart data by Day, Week, Month, or Year


### Empty State

If no feedback matches the current search or filter, the app displays a clear empty state instead of leaving the results area blank.

### Responsive Design

The layout is responsive and works across desktop and smaller screens. Feedback cards collapse into a single-column layout on smaller viewports.

---

## Tech Stack

### Next.js 15

Next.js was used for the application structure and routing. The App Router provides a modern React setup while keeping the project lightweight for a single-page dashboard.

### TypeScript

TypeScript was used to define the feedback data model, sentiment types, and chart grouping types. This helps prevent invalid sentiment values and keeps the data flow easier to reason about.

### Tailwind CSS

Tailwind CSS was used for styling because it supports fast, consistent UI development without introducing separate CSS files for each component. It also made it easier to maintain a clean, minimal visual system within the assessment time window.

### Zustand

Zustand was used for lightweight UI state management. The app only needs to manage the search query and active sentiment filter globally, so Zustand provides a simple solution without unnecessary complexity.

### Chart.js and react-chartjs-2

Chart.js was used for the feedback trend visualization. The chart is implemented as a bar chart because the data is count-based and relatively small, making bars easier to read than a smoothed line chart.

### lucide-react

lucide-react was used for simple interface icons such as search, dropdown, and empty state icons.

---

## Design Notes

The interface is designed to feel minimal, polished, and easy to scan.

Key design choices:

- Neutral color palette
- White card surfaces
- Subtle borders and shadows
- Generous spacing
- Rounded corners
- Sentiment color used only where it adds meaning
- Simple controls instead of complex dashboard widgets
---

## Problems Considered and Solutions

### Zustand State in Next.js App Router

A global Zustand store can be problematic in server-rendered environments because state may be shared across requests if the store is created as a module-level singleton.

**Solution:** The app uses a store factory with a provider pattern so each app instance receives its own store.

### Stale Filtered Results

Storing filtered feedback as separate state can lead to stale UI when the search query or sentiment filter changes.

**Solution:** The filtered list is derived during render from the current search query and active sentiment.


---

## Tradeoffs and Future Improvements


### Current Tradeoffs

- Uses static data instead of a backend API
- Does not include pagination because the dataset is small
- Does not include authentication
- Keeps chart interactions simple and focused

### Possible Future Improvements

- Add backend API integration
- Add date range filtering
- Add sorting by newest or oldest feedback
- Add pagination or virtualization for larger datasets
- Add URL query parameters for shareable filter states
- Add summary metrics such as positive rate and negative rate