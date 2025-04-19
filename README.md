# Shopify Product Data Explorer

A Next.js application that connects to a Shopify store, fetches product data via GraphQL API, and allows viewing, searching, and exporting product information including variants and inventory details.

## Features

- Connect to any Shopify store using the Storefront API access token
- Fetch comprehensive product data including:
  - Basic product information
  - Variants and options
  - Inventory information
  - Images and pricing
- View product data in an intuitive, sortable, and searchable table
- Expand rows to view variant details
- Export data in CSV format
- Responsive UI design

## Technologies Used

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS for styling
- Apollo Client for GraphQL API calls
- CSV-stringify for data export
- React Icons for UI elements

## Setup Instructions

1. **Clone the repository:**

```bash
git clone <repository-url>
cd shopify-store-test-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create .env file**
    - Use the `.env.example` file in the directory as a reference and place your access_token and store domain values there

4. **Run the development server:**

```bash
npm run dev
```

5. **Access the application:**

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## Setting up Shopify Store Access

To use this application, you need a Shopify store and a Storefront API access token:

1. Create a free Shopify Developer account and set up a store
2. Add some test products to your store with various options and variants
3. Generate a Storefront API access token:
   - Go to your Shopify Admin → Apps → Develop apps
   - Create a new app
   - Configure Storefront API scopes (ensure `unauthenticated_read_product_listings` is enabled)
   - Generate a Storefront API access token
4. Use your store domain (e.g., `your-store.myshopify.com`) and the access token to connect the application

## Development

This project follows modern React best practices with a clean component architecture:

- `app/` - Next.js App Router structure
- `app/components/` - Reusable UI components
- `app/lib/` - Apollo client and GraphQL queries
- `app/utils/` - Data transformation and export utilities
- `app/services/` - Shopify API service layer
- `app/api/` - Backend API endpoints for secure data fetching