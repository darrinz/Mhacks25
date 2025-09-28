# Schemas:

## Standardizer Input/Output:
```
{
  "user": "John Doe",
  "meeting": "Q4 Planning Session",
  "questions": [
    {
      "question": "What are the main goals for Q4?",
      "response": "Focus on user experience improvements and performance optimization"
    },
    {
      "question": "What blockers do you anticipate?",
      "response": "Resource allocation and timeline constraints for the new feature set"
    },
    {
      "question": "How will you measure success?",
      "response": "User engagement metrics and application performance benchmarks"
    }
  ]
}
```

## Filterizer Output:
```
{
  "meeting_topics": [
    {
      "topic": "Decision and Alignment on 'Project Chimera' Deadline & Blockers",
      "priority": "High",
      "reasoning": "Raised by all participants and involves a direct conflict on timeline feasibility, a critical technical blocker, and a dependent team being blocked.",
      "summary_of_points": "There is a critical disconnect on the October 15th deadline. Priya is focused on the external commitment, while Ben has identified a fundamental technical blocker in the database migration that makes this date highly improbable. This issue is also blocking the design team from completing the new dashboard. The core discussion must be to resolve this conflict and align on a realistic path forward.",
      "submitted_by": ["Priya Sharma", "Ben Carter", "Chloe Davis"]
    }
  ],
  "email_content": [
    "Update: The Q3 performance reviews are complete and have been submitted to HR.",
    "Update: New logo assets for the marketing site are finished and available in the shared drive.",
    "Technical Note for Engineering: The details regarding the primary key constraint violation are available in ticket #781."
  ]
}
```










This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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
