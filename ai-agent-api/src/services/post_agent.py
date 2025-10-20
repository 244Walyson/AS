from crewai import Agent, Task, Crew, LLM


class InstagramPostService:
    def __init__(self):
        self.llm = LLM(
            model="gemini/gemini-2.0-flash",
            api_key="AIzaSyCvkMWVT6VbRqgSeHBnLECHRbJWBVQE9yE",
            verbose=True
        )

    def generate_post(self, topic: str, lang: str = 'en') -> dict:
        """
        Generates a short Instagram post description and a short, realistic image prompt
        suitable for models like runwayml/stable-diffusion-v1-5.
        """

        content_agent = Agent(
            role='Instagram Content Creator',
            goal='Generate Instagram post content: a short description and a concise, realistic image prompt.',
            backstory="""
            The agent creates Instagram content. The description should be short, current, and engaging.
            The image prompt should be concise, realistic, and easy for AI image generators like Stable Diffusion to create.
            The image prompt must not exceed 10 words and must be written in english.
            """,
            tools=[],
            verbose=True,
            llm=self.llm,
            allow_delegation=True,
            max_rpm=30
        )

        content_task = Task(
            description=f"""
            Create Instagram content for the topic: "{topic}".
            1. Write a short, engaging description (1-2 sentences) that is relevant to current events or everyday life.
            2. Generate a short, realistic image prompt (max 10 words) that an AI model like runwayml/stable-diffusion-v1-5 can generate accurately.

            IMPORTANT:
            - description: Write in {lang}.
            - image_prompt: Write in english.
            - Output must be in JSON format like this:

            {{
                "description": "Short Instagram description",
                "image_prompt": "Short realistic prompt for AI image generation"
            }}
            """,
            agent=content_agent,
            expected_output="""
            {
                "description": "A cozy morning coffee moment at home, perfect to start the day.",
                "image_prompt": "person drinking coffee at a table, morning light"
            }
            """
        )

        crew = Crew(
            agents=[content_agent],
            tasks=[content_task],
            verbose=True
        )

        result = crew.kickoff()

        print(result.raw)
        return result.raw