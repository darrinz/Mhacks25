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
## Agendizer Output:
```
{
  "topic": "Decision and Alignment on 'Project Chimera' Deadline & Blockers",
  "bullets": [
    "critical disconnect on the October 15th deadline",
    "
  ]
  "people": [
    "Alice Smith",
    "John Doe",
  ]
}


```

### Test Case:
```
[
  {
    "name": "Maria Garcia",
    "responses": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "answer": "The absolute top priority is the go/no-go decision for the Project Chimera launch. We are committed to an October 15th date with the client, and we need to lock in that plan. I also wanted to float the idea of trying a new project management tool I saw called 'Linear', maybe something to think about for next quarter."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "answer": "I have drafted all client communications for the launch and have had them pre-approved by legal. The press release is also ready. Basically, the entire external-facing launch plan is finalized and just waiting for the green light from the technical team."
      },
      {
        "question": "What are the most significant blockers, risks, or challenges you're facing right now? Where do you need help or a decision from the team?",
        "answer": "My primary blocker is the lack of a confident 'go' from the engineering and QA teams. I keep hearing about potential issues, but I need a firm commitment in this meeting so I can manage client expectations. The risk of not deciding today is that we miss our communication window with the client."
      }
    ]
  },
  {
    "name": "Leo Schmidt",
    "responses": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "answer": "The only topic that matters is the critical data integrity bug in the Chimera migration script. Everything else is secondary until that is resolved. I guess we could also talk about the new holiday schedule, but the bug is the real issue."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "answer": "I've identified the root cause. It's an edge case in the ORM's handling of polymorphic associations when a specific foreign key is null. It's causing cascading deletes that are wiping out user profile data. I spent all of yesterday running diagnostics and was able to reproduce it consistently in the staging-2 environment. The fix requires a significant refactor of the data access layer, it's not a simple patch."
      },
      {
        "question": "What are the most significant blockers, risks, or challenges you're facing right now? Where do you need help or a decision from the team?",
        "answer": "The blocker is the flawed script. I am stating clearly that a fix, plus comprehensive testing and data validation, will take a minimum of 5-7 days. The October 15th launch date is not possible. Pushing for it would be irresponsible. Also on a smaller note, my request for new noise-canceling headphones hasn't been approved and it's making it hard to concentrate."
      }
    ]
  },
  {
    "name": "Aisha Khan",
    "responses": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "answer": "We need a final decision on the data schema for the user dashboard. Also, I'd like to propose a team lunch next week to celebrate the completion of the new design system."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "answer": "The final high-fidelity mockups for every screen in the Chimera project are complete, but they are all based on the original data schema. We also published the v2 of our company's branding guide, which was a huge effort."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're facing right now? Where do you need help or a decision from the team?",
        "answer": "Yes, we are 100% blocked. We cannot convert our designs into implementation specs for the front-end team until the backend data structure is finalized. Any change could require a major redesign of several key dashboards. We are effectively paused."
      }
    ]
  },
  {
    "name": "Sam Jones",
    "responses": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "answer": "I need to discuss the deployment and rollback strategy for Chimera. If the migration script is as unstable as Leo says, we need a rock-solid plan for reverting a failed deployment instantly."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "answer": "The new staging environment, staging-2, is fully provisioned and I've handed the credentials over to Leo and Fatima for their testing. The CI/CD pipeline has been built, but it's configured for the old data schema."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing right now? Where do you need help or a decision from the team?",
        "answer": "My main blocker is the same as Aisha's; my Terraform scripts for the production environment depend on a stable schema. If that changes, I have to refactor a significant amount of infrastructure-as-code. Also, the build runners have been really slow lately, which is increasing our deployment times."
      }
    ]
  },
  {
    "name": "Olivia Chen",
    "responses": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "answer": "We need to give a final 'go' or 'no go' on the marketing campaign for the October 15th launch. This is my only critical item."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "answer": "All social media, email, and ad creatives are finalized. We have a signed contract with our ad partner that begins on October 12th to build hype. We are completely ready to execute the launch plan."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing right now? Where do you need help or a decision from the team?",
        "answer": "The risk is purely financial and reputational. We have already paid a non-refundable $25,000 deposit for the ad placements. If we delay the launch, we lose that money and have to explain the delay to our audience who are expecting the launch. We need a final decision now."
      }
    ]
  },
  {
    "name": "David Miller",
    "responses": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "answer": "I'd like to quickly sync on the API endpoints for the new user dashboard so I can finalize the data fetching logic."
      },
      {
        "question": "On any of the key topics (yours or others'), what progress have you made, contributions can you share, or updates can you provide since our last sync?",
        "answer": "Progress has been great! The React components for the dashboard are about 90% complete in Storybook. They are fully themed and responsive, just waiting for the final data contract from the backend to hook everything up."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing right now? Where do you need help or a decision from the team?",
        "answer": "No major blockers on my end, really. Just need that final API spec from Leo's team and I can wrap things up. Everything feels like it's in a good place from my perspective."
      }
    ]
  },
  {
    "name": "Fatima Al-Jamil",
    "responses": [
      {
        "question": "What key topics, decisions, or agenda items are most important for us to cover in this meeting to make the best use of our time?",
        "answer": "My only topic is the official QA sign-off status for the Chimera release."
      },
      {
        "question": "What progress have you made, or what contributions can you share on any of these topics since our last sync?",
        "answer": "We have completed and automated the full regression test plan for all existing, non-Chimera features. The test plan for the new features is written but cannot be executed yet."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing right now? Where do you need help or a decision from the team?",
        "answer": "To be unequivocal: the release is blocked. We will not provide QA sign-off until the 52 critical and major bugs filed against the data migration feature are resolved and have passed a full regression test. The release is a 'no go' from a quality standpoint. The full list is in TestRail under 'Chimera-Release-Blockers'."
      }
    ]
  }
]
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
