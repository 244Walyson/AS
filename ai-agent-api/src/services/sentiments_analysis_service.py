from tabnanny import verbose

from crewai import Agent, Task, Crew, LLM


class SentimentAnalysisService:
    def __init__(self):
       self.llm = LLM(
        model="openrouter/deepseek/deepseek-r1:free",
        api_key="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",
        verbose=True
       )

    def get_sentiment(self, text: str, lang: str = 'en') -> str:
        analyst = Agent(
            role='Sentiment Analysis Agent',
            goal='Analyze sentiment in social media comments and provide detailed insights.',
            backstory="""The agent is tasked with analyzing social media comments and extracting detailed sentiment information, including emotions, intensity, reasons, and context.""",
            tools=[],
            verbose=True,
            llm=self.llm,
            allow_delegation=True,
            max_rpm=30
        )

        analyst_task = Task(
            description=f"""
            Please analyze the following social media comment "{text}".
            Now provide the sentiment analysis in the specified format:
            1. Sentiment polarity (positive, negative, or neutral).
            2. Sentiment intensity (weak, moderate, or strong).
            3. The predominant emotion expressed in the comment (joy, anger, sadness, etc.).
            4. The sentiment value (a numerical value from 0 to 1, where 0 is neutral and 1 is the strongest sentiment).
            5. The reasons or underlying motivations for the sentiment, separating positive and negative (e.g., "Appreciation for the product's quality", "Concern about the price").
            6. The context of the comment, including tone (formal, informal, sarcastic, etc.), whether there is irony or sarcasm, and any ambiguity.
            7. Entities mentioned (e.g., brands, products, people) and the sentiment associated with each.
            8. Relevant hashtags or topics mentioned in the comment.
            9. Type of interaction (e.g., feedback, question, criticism).
            10. The potential social impact of the comment (low, medium, high), based on the relevance of the text.
            11. Suggestions or feedback based on the comment (if applicable).
            
            IMPORTANT
            - the content must be written in {lang}
            Please provide the output in JSON format:
            """,
            agent=analyst,
            expected_output="""
            {
               "sentiment": "positive",
               "intensity": "high",
               "emotion": "joy",
               "sentiment_value": 0.75,
               "motivation": "Appreciation for the product's quality",
               "context": {
                 "reason_positive": "Good product quality",
                 "reason_negative": "Price is too high",
                 "tone": "informal",
                 "sarcasm": false
               },
               "entities": ["ProductX", "CompanyY"],
               "hashtags": ["#GreatProduct", "#ExpensiveButGood"],
               "interaction_type": "feedback",
               "impact": "high",
               "feedback": "The company should consider offering discounts"
            }
            """
        )

        crew = Crew(
            agents=[analyst],
            tasks=[analyst_task],
            verbose=True,
        )

        result = crew.kickoff()

        print(result)

        return str(result.raw)

