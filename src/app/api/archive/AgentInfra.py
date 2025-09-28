from textwrap import dedent
from crewai import Agent

# from tools.ExaSearchTool import tools

class AgendaCreationAgents():
	def standardizer_agent(self):
		return Agent(
			role='Standardizer specialist',
			goal='''Process the raw form input with questions and answers. 
			Standardize the language, correct typos, normalize formatting, and account for
			language differences. Ensure all entries follow a consistent structure while 
			preserving original meaning and intent.''',
			# tools=tools(),
			backstory=dedent("""\
					As a Research Specialist, your mission is to uncover detailed information
					about the individuals and entities participating in the meeting. Your insights
					will lay the groundwork for strategic meeting preparation."""),
			verbose=True
		)

	def industry_analysis_agent(self):
		return Agent(
			role='Industry Analyst',
			goal='Analyze the current industry trends, challenges, and opportunities',
			# tools=tools(),
			backstory=dedent("""\
					As an Industry Analyst, your analysis will identify key trends,
					challenges facing the industry, and potential opportunities that
					could be leveraged during the meeting for strategic advantage."""),
			verbose=True
		)

	def meeting_strategy_agent(self):
		return Agent(
			role='Meeting Strategy Advisor',
			goal='Develop talking points, questions, and strategic angles for the meeting',
			# tools=tools(),
			backstory=dedent("""\
					As a Strategy Advisor, your expertise will guide the development of
					talking points, insightful questions, and strategic angles
					to ensure the meeting's objectives are achieved."""),
			verbose=True
		)

	def summary_and_briefing_agent(self):
		return Agent(
			role='Briefing Coordinator',
			goal='Compile all gathered information into a concise, informative briefing document',
			tools=tools(),
			backstory=dedent("""\
					As the Briefing Coordinator, your role is to consolidate the research,
					analysis, and strategic insights."""),
			verbose=True
		)