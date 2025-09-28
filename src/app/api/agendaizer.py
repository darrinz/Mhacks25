from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv
from prompts_config import PROMPTS
import json
from uagents import Agent, Context, Model

load_dotenv()
client = genai.Client()

class FilteredMeetingTopicsByPriority(Model):
    topic: str
    priority: str
    reasoning: str
    summary_of_points: str
    submitted_by: list[str] # list of users

class AgendaRequest(Model):
    topics: list[FilteredMeetingTopicsByPriority]

class Agenda(Model):
    content: str

class HealthResponse(Model):
    status: str
    agent: str

agenda_agent = Agent(
    name="agendaizer_agent",
    port=8004,
    seed="agendaizer_info_secret_seed",
    endpoint=["http://127.0.0.1:8004/api/create_agenda/"]
)

async def startup_event(ctx: Context):
    ctx.logger.info(f"Agenda Agent {agenda_agent.name} started!")
    ctx.logger.info(f"Agent address: {agenda_agent.address}")

@agenda_agent.on_rest_get("/api/create_agenda/", HealthResponse)
async def health_check(ctx: Context) -> HealthResponse:
    """Health check endpoint"""
    return HealthResponse(status="healthy", agent="agenda_agent")

@agenda_agent.on_rest_post("/api/create_agenda/", AgendaRequest, Agenda)
async def create_agenda(ctx: Context, req: AgendaRequest) -> Agenda:
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents= f"""{PROMPTS["agendaizer"]["goal"]}\n{req.topics}"""
        )
        parsed = response.text
        return Agenda(content=parsed)
    except Exception as e:
        ctx.logger.error(f"Error: {e}")
        return None

def generate_agenda_markdown(filteredMeetingTopicsByPriority: AgendaRequest):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents= f"""{PROMPTS["agendaizer"]["goal"]}\n{filteredMeetingTopicsByPriority}"""
    )
    parsed = response.text
    return parsed

if __name__ == "__main__":
    agenda_agent.run()
