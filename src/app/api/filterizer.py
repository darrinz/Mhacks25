from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv
from prompts_config import PROMPTS
import json
import time
from uagents import Agent, Context, Model
from mailer import send_email_with_agentmail

load_dotenv()
client = genai.Client()

class QuestionsAndAnswers(Model):
    question: str
    response: str

class FormSubmissionFilteredInput(Model):
    user: str
    meeting: str
    questions: list[QuestionsAndAnswers]

class FilteredMeetingTopicsByPriority(Model):
    topic: str
    priority: str
    reasoning: str
    summary_of_points: str
    submitted_by: list[str] # list of email addresses
    email_content: list[str] = []

class HealthResponse(Model):
    status: str
    agent: str

class FormSubmissionFilteredRequest(Model):
    submissions: list[FormSubmissionFilteredInput]

class FilteredMeetingTopicsResponse(Model):
    topics: list[FilteredMeetingTopicsByPriority]

filterizer_agent = Agent(
    name="filterizer_agent",
    port=8003,
    seed="filterizer_info_secret_seed",
    endpoint=["http://127.0.0.1:8003/api/filter/"]
)

async def startup_event(ctx: Context):
    ctx.logger.info(f"Filterizer Agent {filterizer_agent.name} started!")
    ctx.logger.info(f"Agent address: {filterizer_agent.address}")

@filterizer_agent.on_rest_get("/api/filter", HealthResponse)
async def health_check(ctx: Context) -> HealthResponse:
    """Health check endpoint"""
    return HealthResponse(status="healthy", agent="standardizer_agent")

@filterizer_agent.on_rest_post("/api/filter/", FormSubmissionFilteredRequest, FilteredMeetingTopicsResponse)
async def standardize_user_response(ctx: Context, req: FormSubmissionFilteredRequest) -> FilteredMeetingTopicsResponse:
    try:
        for r in req.submissions:
            user = r.user
            meeting = r.meeting
            questions = r.questions  # list of question and response
            ctx.logger.info(f"Getting user info: {user}")

        filtered_topics_by_priority = filter_question_responses_by_priority(req.submissions)
        return FilteredMeetingTopicsResponse(topics=filtered_topics_by_priority)
    except Exception as e:
        ctx.logger.error(f"Error: {e}")
        return FilteredMeetingTopicsResponse(topics=[])

def filter_question_responses_by_priority(question_answer_responses):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents= f"""{PROMPTS["email_filterizer"]["goal"]}\n{question_answer_responses}""",
        config={
            "response_mime_type": "application/json",
        },
    )
    parsed = json.loads(response.text)
    email_content = parsed["email_content"]
    filteredMeetingTopicsByPriority = [
        FilteredMeetingTopicsByPriority(**mt, email_content=email_content)
        for mt in parsed["meeting_topics"]
    ]
    return filteredMeetingTopicsByPriority

if __name__ == "__main__":
    filterizer_agent.run()
