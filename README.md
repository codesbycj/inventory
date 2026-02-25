# Inventory Management App

A React-based inventory management dashboard for tracking stock levels across product categories. Built with TypeScript, Tailwind CSS, and React Query.

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Query (TanStack)** - Server state management with optimistic updates
- **React Hook Form + Zod** - Form handling and validation
- **React Router** - Client-side routing
- **Lucide React** - Icons

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## Project Structure

```
src/
  assets/          # Static assets
  components/      # Reusable UI components
    InventoryTable.tsx
    UpdateStockModal.tsx
  data/            # Mock API and seed data
    mockApi.ts
  hooks/           # Custom React hooks
    useInventory.ts
  pages/           # Page-level components
    InventoryPage.tsx
  types/           # TypeScript type definitions
    inventory.ts
  App.tsx           # Root component with routing
  main.tsx          # Entry point
  index.css         # Global styles
```

## Features

- View inventory items with name, SKU, category, and stock level
- Search/filter items by name, SKU, or category
- Inline stock editing via modal with form validation
- Optimistic updates (UI updates instantly, rolls back on failure)
- Loading and error states
- Low stock indicators (items below 50 units)
- Responsive design

## License

Private
