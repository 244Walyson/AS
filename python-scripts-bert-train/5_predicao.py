from transformers import BertForSequenceClassification, BertTokenizer
import torch

# Carregar o modelo e o tokenizer
model_path = './modelo/modelo_finetuned'
model = BertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizer.from_pretrained(model_path)

# Definir a função de predição
def predict(text):
    # Tokenizar o texto de entrada
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)

    # Mover os tensores para a GPU, se disponível
    if torch.cuda.is_available():
        inputs = {k: v.to('cuda') for k, v in inputs.items()}
        model.to('cuda')

    # Fazer a predição
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

    # Obter a classe predita
    prediction = torch.argmax(logits, dim=-1).item()
    return prediction

# Mapear classes para sentimentos
def sentiment_label(prediction):
    if prediction == 0:
        return "Negativo"
    elif prediction == 1:
        return "Neutro"  # Adicione a classe neutra aqui
    elif prediction == 2:
        return "Positivo"
    else:
        return "Desconhecido"

if __name__ == "__main__":
    # Texto para predição
    sample_texts = [
        "produto de ótima qualidade, estou muito feliz por ter comprado",
        "produto péssimo",
        "insatisfeito com a qualidade",
        "ótimo, compraria novamente",
        "a entrega foi dentro do prazo"  # Exemplo de texto neutro
    ]

    # Fazer a predição
    for text in sample_texts:
        prediction = predict(text)
        sentiment = sentiment_label(prediction)
        print(f"A predição para o texto '{text}' é: {prediction} ({sentiment})")
