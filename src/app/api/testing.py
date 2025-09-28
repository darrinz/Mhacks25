import json
import os
from pathlib import Path
import time

from filterizer import filter_question_responses_by_priority
from standardizer import standardize_question_responses
from agendaizer import generate_agenda_markdown

# from mailer import send_email_with_agentmail

test_cases_dir = Path(__file__).parent / "test_cases"

test_cases = []
for file_path in test_cases_dir.glob("*.json"):
    with open(file_path, "r") as f:
        data = json.load(f)
        for d in data:
            standardized = standardize_question_responses(d)
            #print(standardized)
            test_cases.append(standardized)
        break

all_email_topics = []

filtered = filter_question_responses_by_priority(test_cases)
for f in filtered:
    all_email_topics.append(f.email_content)
agenda = generate_agenda_markdown(filtered)
print(agenda)

print(all_email_topics)

'''
mail_items = []
for 

send_email_with_agentmail(["ayushgr@umich.edu", "ayushgreddy@gmail.com"], , meeting_name)
'''