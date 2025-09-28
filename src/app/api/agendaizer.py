from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv
from prompts_config import PROMPTS
import json
from uagents import Agent, Context, Model

load_dotenv()
client = genai.Client()

class FilteredMeetingTopicsByPriority(BaseModel):
    topic: str
    priority: str
    reasoning: str
    summary_of_points: str
    submitted_by: list[str] # list of users

def generate_agenda_markdown(filteredMeetingTopicsByPriority: list[FilteredMeetingTopicsByPriority]):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents= f"""{PROMPTS["agendaizer"]["goal"]}\n{filteredMeetingTopicsByPriority}"""
    )
    parsed = response.text
    # print(parsed)
    return parsed
