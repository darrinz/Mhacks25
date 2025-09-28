import json
import os
from pathlib import Path
import time

from filterizer import filter_question_responses_by_priority, FormSubmissionFilteredInput, QuestionsAndAnswers
from agendaizer import generate_agenda_markdown

# from mailer import send_email_with_agentmail

test_cases_dir = Path(__file__).parent / "test_cases"

print("🧪 Testing with Rate Limiting")
print("=" * 40)

# Load test data and convert to FormSubmissionInput objects
test_cases = []
for file_path in test_cases_dir.glob("large_new.json"):  # Use the updated test case
    with open(file_path, "r") as f:
        data = json.load(f)
        for d in data:
            # Convert to FormSubmissionFilteredInput with rate limiting
            questions = [QuestionsAndAnswers(**qa) for qa in d['questions']]
            test_cases.append(FormSubmissionFilteredInput(
                user=d['user'],
                meeting=d['meeting'],
                questions=questions
            ))
        break

print(f"Loaded {len(test_cases)} test cases")

# Process through filterizer (this handles standardization internally with rate limiting)
print("Processing through filterizer...")
filtered = filter_question_responses_by_priority(test_cases)

# Generate agenda
print("Generating agenda...")
agenda = generate_agenda_markdown(filtered)
print("\n" + "="*50)
print("GENERATED AGENDA:")
print("="*50)
print(agenda)

'''
mail_items = []
for 

send_email_with_agentmail(["ayushgr@umich.edu", "ayushgreddy@gmail.com"], , meeting_name)
'''