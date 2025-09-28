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

class QuestionsAndAnswers(BaseModel):
    question: str
    response: str

class FormSubmissionInput(BaseModel):
    user: str  # This will now be the email address
    meeting: str
    questions: list[QuestionsAndAnswers]

class FormSubmissionFilteredInput(BaseModel):
    user: str  # This will now be the email address
    meeting: str
    questions: list[QuestionsAndAnswers]

class FilteredMeetingTopicsByPriority(BaseModel):
    topic: str
    priority: str
    reasoning: str
    summary_of_points: str
    submitted_by: list[str] # list of email addresses
    email_content: list[str] = []

def create_mock_output(question_answer_responses: list[FormSubmissionInput]):
    """Create mock output when API is unavailable"""
    # Extract all email addresses
    all_emails = set()
    for response in question_answer_responses:
        all_emails.add(response.user)
    
    # Mock filtered topics
    mock_topics = [
        FilteredMeetingTopicsByPriority(
            topic="Project Planning and Resource Allocation",
            priority="High",
            reasoning="Multiple participants raised concerns about project planning and resource allocation",
            summary_of_points="The team needs to align on project goals, budget allocation, and resource planning for the upcoming quarter.",
            submitted_by=list(all_emails),
            email_content=[
                "Update: Database optimization work is in progress",
                "Update: Financial analysis has been completed",
                "FYI: New server setup is complete and ready for testing"
            ]
        )
    ]
    
    return mock_topics

def filter_question_responses_by_priority(question_answer_responses: list[FormSubmissionInput]):
    # Add rate limiting to avoid hitting API quotas
    print("⏳ Adding rate limiting delay to avoid API quotas...")
    time.sleep(2)  # Wait 2 seconds before making API call
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents= f"""{PROMPTS["email_filterizer"]["goal"]}\n{question_answer_responses}""",
            config={
                "response_mime_type": "application/json",
            },
        )
    except Exception as e:
        print(f"❌ API Error: {str(e)}")
        print("🔄 Falling back to mock data...")
        return create_mock_output(question_answer_responses)
    print(response.text)
    parsed = json.loads(response.text)
    # print(parsed)
    email_content = parsed["email_content"]
    filteredMeetingTopicsByPriority = [FilteredMeetingTopicsByPriority(**mt, email_content = email_content) for mt in parsed["meeting_topics"]]
    
    # Send email if there's email content to send
    if email_content and len(email_content) > 0:
        # Extract all unique email addresses from the submitted_by fields
        all_emails = set()
        for topic in filteredMeetingTopicsByPriority:
            all_emails.update(topic.submitted_by)
        
        # Add your email for testing
        all_emails.add("ayushgr@umich.edu")  # Replace with your actual email
        
        # Convert to list for the email function
        recipients = list(all_emails)
        
        # Get meeting title from the first response (assuming all responses are for the same meeting)
        meeting_title = question_answer_responses[0].meeting if question_answer_responses else "Meeting"
        
        # Send the email
        print(f"Sending email to {len(recipients)} recipients: {recipients}")
        email_success = send_email_with_agentmail(recipients, email_content, meeting_title)
        
        if email_success:
            print("✅ Email sent successfully!")
        else:
            print("❌ Failed to send email")
    
    return filteredMeetingTopicsByPriority


