from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client()

genai.configure(api_key=GEMINI_API_KEY)

def call_gemini_pro(prompt, input):
    return client.models.generate_content(
        model="gemini-2.5-pro", contents= prompt + input
    )

prompt_standardize="""
    **STANDARDIZATION GOALS:**
    - Convert informal language to professional equivalents (e.g., "kinda" → "somewhat", "yeah" → "yes").
    - Normalize emotional expressions while preserving core meaning (e.g., "this is a complete mess!" → "this is fundamentally flawed").
    - Remove excessive punctuation and casual formatting.
    - Standardize tone to professional business communication.
    - Extract core content regardless of presentation style.

    **TASK:**
    You will be given a JSON object for a single participant. This object contains their name and a list of their responses, where each response is a question-answer pair.
    1.  Parse the input JSON object.
    2.  For each question-answer pair in the "responses" list, apply the "STANDARDIZATION GOALS" ONLY to the text in the "answer" field.
    3.  The "name" field and all "question" fields must remain completely unchanged.
    4.  Return a single JSON object with the exact same structure as the input, containing the original name and the original questions paired with their newly standardized answers.

    **IMPORTANT:** Return ONLY the modified JSON object. Do not add any commentary, explanations, or additional formatting like markdown code fences.

    ---
    ### EXAMPLE ###
    <INPUT>
    {
    "name": "Ben Carter",
    "responses": [
        {
        "question": "What key topics or agenda items do you think we need to discuss in this meeting?",
        "answer": "yeah i wanna talk about the project chimera timeline... it's like the only thing that matters rn tbh"
        },
        {
        "question": "What progress have you made or what contributions can you share on any of these topics since our last sync?",
        "answer": "well i found the root cause of the data bug, been hammering away at a patch for 2 days straight!!!!"
        },
        {
        "question": "Are there any blockers, risks, or challenges you're currently facing that the team should be aware of?",
        "answer": "the db script is a complete mess. i just dont see how we can hit oct 15th. its not gonna happen."
        },
        {
        "question": "Is there any other information or F.Y.I. update you'd like to share with the team?",
        "answer": "uhhh i put the deets in ticket #781 for any1 who's interested in the pkey stuff"
        }
    ]
    }
    </INPUT>

    ### YOUR RESPONSE ###
    {
    "name": "Ben Carter",
    "responses": [
        {
        "question": "What key topics or agenda items do you think we need to discuss in this meeting?",
        "answer": "Yes, I would like to discuss the Project Chimera timeline, as it is a top priority."
        },
        {
        "question": "What progress have you made or what contributions can you share on any of these topics since our last sync?",
        "answer": "I have identified the root cause of the data integrity failure and have been developing a patch for the past two days."
        },
        {
        "question": "Are there any blockers, risks, or challenges you're currently facing that the team should be aware of?",
        "answer": "The database migration script is fundamentally flawed. It is highly improbable that we can meet the October 15th deadline without significant risk."
        },
        {
        "question": "Is there any other information or F.Y.I. update you'd like to share with the team?",
        "answer": "The technical details regarding the primary key constraint violation are available in ticket #781."
        }
    ]
    }
    ---

    USER RESPONSE TO ACT ON:

"""


input0 = """
    Alice Smith:

    Hi team, I would like to talk about the upcoming deadline for the paper submission, also I would like to discuss the future directions for this project.
    Also, I want to discuss being able to bring in pets into the lab, I think that it would be a good pick me up in the middle of the day and I don't think that anyone here is allergic, let me know if you are tho.
    I also wanted to discuss buying a team coffee machine for the office instead of having to go buy from the shop down the street everyday, I think that it would save us a lot of money.__init__
    Also, I wanted to let everyone know that I finished the fronted button design on the website.
"""

input1 = """
Priya Sharma:

Okay team, top priority for me is the Project Chimera deadline. We're committed to a client delivery on Oct 15th and we need to lock down our final deployment schedule.
I also want to let everyone know that the Q3 performance reviews are complete and have been submitted to HR. Finally, let's set aside 10 mins to brainstorm ideas for the virtual holiday party.
"""

input2 = """
Ben Carter:

My main point is also Project Chimera. I'm seeing a critical issue with the database migration script that's causing data integrity failures in the staging environment.
My estimate is this will take at least 5 full days to properly fix and validate. I don't see how we can possibly hit the Oct 15th deadline without cutting major corners.
The specific error is a primary key constraint violation when migrating the `user_profiles` table, detailed in ticket #781.
"""

input3 = """
Chloe Davis:

Circling back on Project Chimera, the design team is blocked. We can't finalize the new user dashboard mockups until a decision is made on the data migration issue Ben mentioned.
Is the data structure going to change? We need to know this week. Also, I've finished the new logo assets for the marketing site and they are now available in the shared drive.
"""


responses = [
  """{
    "name": "Priya Sharma",
    "responses": [
      {
        "question": "What key topics or agenda items do you think we need to discuss in this meeting?",
        "answer": "The main topic is the Project Chimera deadline. We need to lock down the final deployment schedule."
      },
      {
        "question": "What progress have you made or what contributions can you share on any of these topics since our last sync?",
        "answer": "I've finalized the client communications regarding the October 15th launch date and have the press release drafted."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing that the team should be aware of?",
        "answer": "The primary blocker is getting a firm commitment from the engineering team on the deployment schedule to ensure we hit our committed date."
      },
      {
        "question": "Is there any other information or F.Y.I. update you'd like to share with the team?",
        "answer": "Just an F.Y.I., Q3 performance reviews are complete and have been submitted to HR."
      }
    ]
  }""",
  """{
    "name": "Ben Carter",
    "responses": [
      {
        "question": "What key topics or agenda items do you think we need to discuss in this meeting?",
        "answer": "Definitely the Project Chimera timeline. It's the only thing that matters right now."
      },
      {
        "question": "What progress have you made or what contributions can you share on any of these topics since our last sync?",
        "answer": "I've identified the root cause of the data integrity failure in the staging environment. I've been working on a patch for the last two days."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing that the team should be aware of?",
        "answer": "The database migration script is fundamentally flawed and will take at least 5 full days to fix and properly validate. This is a hard blocker for the October 15th date; it's not possible without extreme risk."
      },
      {
        "question": "Is there any other information or F.Y.I. update you'd like to share with the team?",
        "answer": "The details are in ticket #781 for anyone interested in the technical specifics of the primary key constraint violation."
      }
    ]
  }""",
  """{
    "name": "Chloe Davis",
    "responses": [
      {
        "question": "What key topics or agenda items do you think we need to discuss in this meeting?",
        "answer": "We need a final decision on Project Chimera's data structure."
      },
      {
        "question": "What progress have you made or what contributions can you share on any of these topics since our last sync?",
        "answer": "On a different project, the new logo assets for the marketing site are finished and available in the shared drive."
      },
      {
        "question": "Are there any blockers, risks, or challenges you're currently facing that the team should be aware of?",
        "answer": "My design team is completely blocked on the new user dashboard mockups until we have a stable data schema from Ben's fix. We can't proceed."
      },
      {
        "question": "Is there any other information or F.Y.I. update you'd like to share with the team?",
        "answer": ""
      }
    ]
  }"""
]

all_standardized_responses = ""
for index, response in enumerate(responses):
    # Get the standardized text for the current user
    standardized_text = call_gemini_pro(prompt_standardize, response)
    
    # Format it with the index and add it to the main string
    all_standardized_responses += f"[{index}]\n{standardized_text.text}\n\n"

print(all_standardized_responses)


# response_standardize = client.models.generate_content(
#     model="gemini-2.5-pro", contents="""
#     You are a professional meeting response standardization agent. Your task is to take participant responses to meeting invitations and standardize them to reduce bias and make them easier for other AI systems to process.

#     BIAS REDUCTION GOALS:
#     - Convert informal language to professional equivalents (e.g., "kinda" → "somewhat", "yeah" → "yes")
#     - Normalize emotional expressions while preserving meaning
#     - Remove excessive punctuation and casual formatting
#     - Standardize tone to professional business communication
#     - Extract core content regardless of presentation style

#     TASK: Take the given meeting response and return ONLY a standardized, professional version that:
#     1. Maintains the original meaning and intent
#     2. Uses professional business language
#     3. Has consistent tone and formatting
#     4. Removes bias from informal typing style
#     5. Is clear and concise

#     IMPORTANT: Return ONLY the author and the standardized text, no explanations or additional formatting, your goal is to just standardize the response as described

#     RESPONSE TO STANDARDIZE:
#     """ + user_input
# )
# print(response_standardize.text)

response_filter = client.models.generate_content(
    model="gemini-2.5-pro", contents="""
    **PRIMARY GOALS:**
    1.  **Synthesize:** Group all related comments, questions, and proposals from the structured inputs into unified topics.
    2.  **Prioritize:** Rank the synthesized topics based on urgency and importance to ensure the meeting focuses on what matters most.
    3.  **Structure:** Compile all relevant discussion points for each topic so context is not lost, while still separating out purely informational updates and deep technical details for an email.

    **DEFINITIONS:**
    -   **Meeting-Worthy Content:** Topics that require the collective intelligence of the group to solve, decide, or align on. The output for these topics must include a summary of all submitted perspectives.
    -   **Email-Worthy Content:** Information that does not benefit from real-time group discussion. This includes:
        1.  **F.Y.I. Updates:** Simple status updates that are purely informational.
        2.  **Technical Details:** Deeply technical specifications, data, or notes that support a meeting topic but would bog down the main discussion.

    **TASK:**
    You will be given a JSON array where each object represents a participant's full, standardized response.
    1.  Analyze the entire array of participant objects provided in the `<INPUT>` section.
    2.  **Use Context:** Pay close attention to the `question` text for each `answer`. An answer to "Are there any blockers...?" is inherently more urgent than an answer to "Is there any other information...?".
    3.  **Group and Synthesize:** Identify distinct topics by analyzing answers across all participants. Group all related points, even if they come from answers to different questions (e.g., a "topic" in Q1 can be related to a "blocker" in Q3).
    4.  **Prioritize and Rank:** For each synthesized meeting topic, determine its priority ('High', 'Medium', or 'Low'). Base this on:
        a. **Frequency:** How many participants raised the topic.
        b. **Inherent Importance:** Blockers, strategic decisions, and conflicts are higher priority than general updates.
    5.  **Compile Details:** For each meeting topic, create a concise summary that includes all related points, questions, and perspectives. List the names of all participants who contributed to the topic.
    6.  **Classify Email Content:** Identify and separate all F.Y.I. updates and deep technical details into the `email_content` list.
    7.  **Format Output:** Structure your final output as a single JSON object.

    **IMPORTANT:** Return ONLY the JSON object. Do not add any commentary or explanations outside of the JSON structure.

    ---
    ### EXAMPLE ###
    <INPUT>
    [
    {
        "name": "Priya Sharma",
        "responses": [
        {"question": "What key topics...?", "answer": "The main topic is the Project Chimera deadline. We need to lock down the final deployment schedule."},
        {"question": "What progress have you made...?", "answer": "I've finalized the client communications regarding the October 15th launch date and have the press release drafted."},
        {"question": "Are there any blockers...?", "answer": "The primary blocker is getting a firm commitment from the engineering team on the deployment schedule to ensure we hit our committed date."},
        {"question": "Is there any other information...?", "answer": "Q3 performance reviews are complete and have been submitted to HR."}
        ]
    },
    {
        "name": "Ben Carter",
        "responses": [
        {"question": "What key topics...?", "answer": "I would like to discuss the Project Chimera timeline, as it is a top priority."},
        {"question": "What progress have you made...?", "answer": "I have identified the root cause of the data integrity failure and have been developing a patch for the past two days."},
        {"question": "Are there any blockers...?", "answer": "The database migration script is fundamentally flawed. It is highly improbable that we can meet the October 15th deadline without significant risk."},
        {"question": "Is there any other information...?", "answer": "The technical details regarding the primary key constraint violation are available in ticket #781."}
        ]
    },
    {
        "name": "Chloe Davis",
        "responses": [
        {"question": "What key topics...?", "answer": "We need a final decision on Project Chimera's data structure."},
        {"question": "What progress have you made...?", "answer": "The new logo assets for the marketing site are finished and available in the shared drive."},
        {"question": "Are there any blockers...?", "answer": "My design team is completely blocked on the new user dashboard mockups until we have a stable data schema from Ben's fix."},
        {"question": "Is there any other information...?", "answer": ""}
        ]
    }
    ]
    </INPUT>

    ### YOUR RESPONSE ###
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
    ---

    USER RESPONSE TO ACT ON:

    """ + all_standardized_responses
)
print(response_filter.text)


# prompt = "Explain the concept of Occam's Razor and provide a simple, everyday example."
# response = client.models.generate_content(
#     model="gemini-2.5-pro",
#     contents=prompt
# )

# print(response.text)