from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv
from prompts_config import PROMPTS
import json
from uagents import Agent, Context, Model

load_dotenv()
client = genai.Client()

class QuestionsAndAnswers(BaseModel):
    question: str
    response: str

class FormSubmissionInput(BaseModel):
    user: str
    meeting: str
    questions: list[QuestionsAndAnswers]

class FormSubmissionFilteredInput(BaseModel):
    user: str
    meeting: str
    questions: list[QuestionsAndAnswers]

class FilteredMeetingTopicsByPriority(BaseModel):
    topic: str
    priority: str
    reasoning: str
    summary_of_points: str
    submitted_by: list[str] # list of users
    email_content: list[str] = []

def filter_question_responses_by_priority(question_answer_responses: list[FormSubmissionInput]):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents= f"""{PROMPTS["email_filterizer"]["goal"]}\n{question_answer_responses}""",
        config={
            "response_mime_type": "application/json",
        },
    )
    print(response.text)
    parsed = json.loads(response.text)
    # print(parsed)
    email_content = parsed["email_content"]
    filteredMeetingTopicsByPriority = [FilteredMeetingTopicsByPriority(**mt, email_content = email_content) for mt in parsed["meeting_topics"]]
    return filteredMeetingTopicsByPriority
