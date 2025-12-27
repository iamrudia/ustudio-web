# ustudio-web

This is a Next.js blog application with a Notion-style editor (Novel.sh).

## Features

- **Rich Text Editor**: Slash commands, markdown support, image uploads.
- **Blog System**: List, Detail, and Edit views.
- **SEO Optimized**: Server-side rendering for blog posts.
- **Dark Mode**: Support via Tailwind CSS.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Copy `.env.local.example` to `.env.local` (or create it) and fill in your keys:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    GOOGLE_API_KEY=...
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open Browser**:
    Visit [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the SQL migration located in `supabase/migrations` to set up your database schema.
