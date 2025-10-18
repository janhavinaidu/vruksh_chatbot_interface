# Research AI Assistant 🔬🤖

An intelligent chatbot for comparative analysis of scientific research topics and authors, powered by real data from PubMed and OpenAlex APIs with AI responses from Cohere.

## Features

✅ **Topic Analysis** - Analyze research topics (e.g., "Leukemia", "COVID-19")  
✅ **Author Analysis** - Analyze individual researchers by name  
✅ **Comparative Analysis** - Compare multiple topics and/or authors  
✅ **Real-Time Data** - Fetches live data from PubMed (35M+ articles) and OpenAlex (240M+ works)  
✅ **AI-Powered Chatbot** - Ask questions and get intelligent insights using Cohere AI  
✅ **Visual Analytics** - Publication trends, top institutions, citation metrics  
✅ **Publication Types** - Breakdown of journal articles, reviews, clinical trials, etc.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
OPENALEX_EMAIL=your-email@example.com
COHERE_API_KEY=your-cohere-api-key
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
