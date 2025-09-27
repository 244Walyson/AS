import pandas as pd
from datasets import load_from_disk

# Carregar os datasets tokenizados
train_dataset = load_from_disk('datasets/tokenized/train_dataset_tokenized')
test_dataset = load_from_disk('datasets/tokenized/test_dataset_tokenized')

# Função para adicionar rótulos
def add_labels(examples):
    examples['labels'] = examples['polarity']  # Coluna com rótulos
    return examples

# Adicionar rótulos
train_dataset = train_dataset.map(add_labels)
test_dataset = test_dataset.map(add_labels)

# Salvar datasets com rótulos
train_dataset.save_to_disk('datasets/tokenized/train_dataset_labeled')
test_dataset.save_to_disk('datasets/tokenized/test_dataset_labeled')

print("Rótulos adicionados e datasets salvos com sucesso!")
