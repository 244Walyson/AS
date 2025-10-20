# from resources.sentiment_analysis_resource import SentimentAnalysisResource

# sentiment_analysis = SentimentAnalysisResource()

# if __name__ == "__main__":
#     sentiment_analysis.consume()

from fastapi import FastAPI
from services.sentiments_analysis_service import SentimentAnalysisService
from services.post_agent import InstagramPostService
from pydantic import BaseModel


app = FastAPI()

instagramPostService = InstagramPostService()

service = SentimentAnalysisService()

class SentimentRequest(BaseModel):
    text: str
    lang: str = 'pt-br'

class PostRequest(BaseModel):
    topic: str
    lang: str = 'pt-br'

@app.post("/sentiment")
async def analyze_sentiment(request: SentimentRequest):
    return service.get_sentiment(text=request.text, lang=request.lang)

@app.post("/instagram_post")
async def generate_instagram_post(request: PostRequest):
    return instagramPostService.generate_post(topic=request.topic, lang=request.lang)

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
