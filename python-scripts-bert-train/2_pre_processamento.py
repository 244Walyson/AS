from datasets import Dataset
from transformers import BertTokenizer
import pandas as pd

# Carregar os datasets
train_df = pd.read_csv('datasets/train/train_dataset.csv')
test_df = pd.read_csv('datasets/train/test_dataset.csv')

# Tokenizer
tokenizer = BertTokenizer.from_pretrained('neuralmind/bert-base-portuguese-cased')

# Função de pré-processamento
def preprocess_function(examples):
    return tokenizer(examples['text'], truncation=True, padding='max_length', max_length=512)

# Criar datasets
train_dataset = Dataset.from_pandas(train_df)
test_dataset = Dataset.from_pandas(test_df)

# Tokenizar
train_dataset = train_dataset.map(preprocess_function, batched=True)
test_dataset = test_dataset.map(preprocess_function, batched=True)

# Salvar datasets tokenizados
train_dataset.save_to_disk('datasets/tokenized/train_dataset_tokenized')
test_dataset.save_to_disk('datasets/tokenized/test_dataset_tokenized')

print("Datasets tokenizados e salvos com sucesso!")
