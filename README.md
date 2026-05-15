##Lumina 

#How to Start Locally

First, install dependencies:

npm install

Then start the local development server:

npm run dev

Open the app in your browser:

http://localhost:3000


---

## Tech Stack

- **Next.js 15** for the React app structure and routing
- **TypeScript** for safer data and component types
- **Tailwind CSS** for fast and consistent styling
- **Zustand** for lightweight search and filter state management
- **Chart.js / react-chartjs-2** for the feedback trend chart
- **lucide-react** for simple UI icons

---

## Design Choices

The UI is designed to be minimal, clean, and easy to scan.

I used a neutral color palette, white cards, subtle borders, rounded corners, and soft shadows to keep the dashboard uncluttered. Sentiment colors are used only where they help communicate meaning: green for positive, gray for neutral, and red for negative.

Feedback is shown in cards because it makes each customer comment easy to separate and read. The search and filter controls are placed above the cards so users can quickly narrow the list.

The chart shows one selected sentiment at a time instead of showing every sentiment together. This keeps the chart easier to read, especially with a small dataset.

---

## State Management

Zustand is used to manage the dashboard’s search and filter state.

The filtered feedback list is not stored separately. Instead, it is calculated during render based on the current search query and selected sentiment. This keeps the logic simple and avoids stale filtered results.

The app also uses a Zustand store factory with a provider pattern instead of a global singleton. This is safer in a Next.js App Router project because server-rendered modules can be reused across requests.

The chart’s selected sentiment and time grouping are kept as local component state because they only affect the chart.

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
