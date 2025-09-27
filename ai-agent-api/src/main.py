from resources.sentiment_analysis_resource import SentimentAnalysisResource

sentiment_analysis = SentimentAnalysisResource()

if __name__ == "__main__":
    sentiment_analysis.consume()

# from fastapi import FastAPI
# from services.sentiments_analysis_service import SentimentAnalysisService
#
# app = FastAPI()
#
# service = SentimentAnalysisService()
#
# @app.get("/")
# async def root():
#     return service.get_sentiment(text="""Who are those guys❓ É com essa pergunta que eu entro para a equipe da dti digital.
#     Hoje foi o meu primeiro dia e fui super bem recebido e cheio de expectativas positivas. Uma empresa com uma proposta totalmente diferente e 100% agilista.
#     Venho fazer parte da Enterprise Rackers (com R mesmo), um cliente dos Estados Unidos, com contato direto em inglês, trabalhando com React e C#.
#     Obrigado Augusto Baldiotti por fazer essa ponte incrível, Isadora Louise e Juliana Paranhos por toda a atenção no processo, vocês são incríveis. ❤️""", lang="pt-br")
#
#
# @app.get("/hello/{name}")
# async def say_hello(name: str):
#     return {"message": f"Hello {name}"}
