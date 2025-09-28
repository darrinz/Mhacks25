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
    user: str  # This will now be the email address
    meeting: str
    questions: list[QuestionsAndAnswers]  

class FilteredQuestionsAndAnswersOutput(BaseModel):
    user: str  # This will now be the email address
    meeting: str
    questions: list[QuestionsAndAnswers]  

info_agent = Agent(
    name="standardizer_agent",
    port=8002,
    seed="product_info_secret_seed",
    endpoint=["http://127.0.0.1:8002/standardize"]
)


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
        contents= f"""{PROMPTS["data_standardizer"]["goal"]}\n{question_answer_responses.json()}""",
        config={
            "response_mime_type": "application/json",
        },
    )
    
    parsed = json.loads(response.text)
    standardized_questions_and_answers = [QuestionsAndAnswers(**qa) for qa in parsed["questions"]]
    return standardized_questions_and_answers
