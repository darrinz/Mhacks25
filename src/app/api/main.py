import json
import os
from pathlib import Path
import time

from filterizer import filter_question_responses_by_priority
from standardizer import standardize_question_responses
from agendaizer import generate_agenda_markdown

from mailer import send_email_with_agentmail

send_email_with_agentmail(["darrinz@umich.edu", "adnanr@umich.edu", "ayushgr@umich.edu"], ["yall", "the", "email", "works!"], "mhacks_smoothie")