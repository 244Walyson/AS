from transformers import BertForSequenceClassification, BertTokenizer, Trainer, TrainingArguments
from datasets import load_from_disk

# Carregar os datasets rotulados
train_dataset = load_from_disk('datasets/tokenized/train_dataset_labeled')
test_dataset = load_from_disk('datasets/tokenized/test_dataset_labeled')

# Inicializar o modelo e o tokenizer
model_name = 'neuralmind/bert-base-portuguese-cased'
model = BertForSequenceClassification.from_pretrained(model_name, num_labels=3)
tokenizer = BertTokenizer.from_pretrained(model_name)

# Configurar parâmetros de treinamento
training_args = TrainingArguments(
    output_dir='./modelo',
    evaluation_strategy='epoch',
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
)

# Inicializar o Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
)

# Treinar o modelo
trainer.train()

# Salvar o modelo e o tokenizer treinados
trainer.save_model('./modelo/modelo_finetuned')
tokenizer.save_pretrained('./modelo/modelo_finetuned')

print("Modelo e tokenizer treinados e salvos com sucesso!")
