import os

from crewai import LLM
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

# Import Gemini LLM
from crewai.llms.gemini import GeminiLLM

@CrewBase
class FormProcessingPipelineCrew:
    """FormProcessingPipeline crew"""

    
    @agent
    def data_standardizer(self) -> Agent:

        
        return Agent(
            config=self.agents_config["data_standardizer"],
            
            
            tools=[

            ],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            max_execution_time=None,
            llm=GeminiLLM(
                model="gemini-pro",
                temperature=0.7,
            ),
            
        )
    
    @agent
    def email_filterizer(self) -> Agent:

        
        return Agent(
            config=self.agents_config["email_filterizer"],
            
            
            tools=[

            ],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            max_execution_time=None,
            llm=GeminiLLM(
                model="gemini-pro",
                temperature=0.7,
            ),
            
        )
    
    @agent
    def agendaizer(self) -> Agent:

        
        return Agent(
            config=self.agents_config["agendaizer"],
            
            
            tools=[

            ],
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=None,
            max_execution_time=None,
            llm=GeminiLLM(
                model="gemini-pro",
                temperature=0.7,
            ),
            
        )
    

    
    @task
    def standardize_form_input(self) -> Task:
        return Task(
            config=self.tasks_config["standardize_form_input"],
            markdown=False,
            
            
        )
    
    @task
    def separate_email_worthy_content(self) -> Task:
        return Task(
            config=self.tasks_config["separate_email_worthy_content"],
            markdown=False,
            
            
        )
    
    @task
    def create_structured_agenda(self) -> Task:
        return Task(
            config=self.tasks_config["create_structured_agenda"],
            markdown=False,
            
            
        )
    

    @crew
    def crew(self) -> Crew:
        """Creates the FormProcessingPipeline crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )

    def _load_response_format(self, name):
        with open(os.path.join(self.base_directory, "config", f"{name}.json")) as f:
            json_schema = json.loads(f.read())

        return SchemaConverter.build(json_schema)
