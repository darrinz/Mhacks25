from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv
from prompts_config import PROMPTS
import json
from uagents import Agent, Context, Model

load_dotenv()
client = genai.Client()

class QuestionsAndAnswers(Model):
    question: str
    response: str

class FormSubmissionInput(Model):
    user: str
    meeting: str
    questions: list[QuestionsAndAnswers]  

class FilteredQuestionsAndAnswersOutput(Model):
    user: str
    meeting: str
    questions: list[QuestionsAndAnswers]  

class HealthResponse(Model):
    status: str
    agent: str

standardizer_agent = Agent(
    name="standardizer_agent",
    port=8002,
    seed="product_info_secret_seed",
    endpoint=["http://127.0.0.1:8002/api/standardize/"]
)

@standardizer_agent.on_event("startup")
async def startup_event(ctx: Context):
    ctx.logger.info(f"Standardizer Agent {standardizer_agent.name} started!")
    ctx.logger.info(f"Agent address: {standardizer_agent.address}")

@standardizer_agent.on_rest_get("/health", HealthResponse)
async def health_check(ctx: Context) -> HealthResponse:
    """Health check endpoint"""
    return HealthResponse(status="healthy", agent="standardizer_agent")

@standardizer_agent.on_rest_post("/api/standardize/", FormSubmissionInput, FilteredQuestionsAndAnswersOutput)
async def standardize_user_response(ctx: Context, req: FormSubmissionInput) -> FilteredQuestionsAndAnswersOutput:
    try:
        user = req.user
        meeting = req.meeting
        questions = req.questions  # list of question and response
        ctx.logger.info(f"Getting user info: {user}")

        standardized_questions = standardize_question_responses(req.dict())
        return FilteredQuestionsAndAnswersOutput(
            user=user,
            meeting=meeting,
            questions=standardized_questions
        )
    except Exception as e:
        print(e)
        return None

def standardize_question_responses(question_answer_responses: dict, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            question_answer_responses = FormSubmissionInput(**question_answer_responses)
            break
        except Exception as e:
            print(f"Attempt {attempt + 1} failed to parse input: {e}")
            if attempt == max_retries - 1:
                raise
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""{PROMPTS["data_standardizer"]["goal"]}\n{question_answer_responses.json()}""",
        config={
            "response_mime_type": "application/json",
        },
    )

    parsed = json.loads(response.text)
    standardized_questions_and_answers = [QuestionsAndAnswers(**qa) for qa in parsed["questions"]]
    return standardized_questions_and_answers

if __name__ == "__main__":
    standardizer_agent.run()