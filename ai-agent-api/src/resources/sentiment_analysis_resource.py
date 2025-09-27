from services.sentiments_analysis_service import SentimentAnalysisService
import pika
import json
import threading

setiment_service = SentimentAnalysisService()

class SentimentAnalysisResource:
    def __init__(self):
        self._host = 'localhost'
        self._port = 5672
        self._username = 'admin'
        self._password = 'admin'
        self._comments_queue = "comments-queue"
        self._sentiments_queue = "sentiments-queue"

        self._connection = None
        self._channel = None
        self._connect()

    def _connect(self):
        try:
            print("[*] Conectando ao RabbitMQ...")
            credentials = pika.PlainCredentials(self._username, self._password)
            params = pika.ConnectionParameters(host=self._host, port=self._port, credentials=credentials, heartbeat=600, blocked_connection_timeout=600)

            self._connection = pika.BlockingConnection(params)
            self._channel = self._connection.channel()

            # Declarar filas
            self._channel.queue_declare(queue=self._comments_queue, durable=True)
            self._channel.queue_declare(queue=self._sentiments_queue, durable=True)

            print("[✔] Conectado ao RabbitMQ")
        except pika.exceptions.AMQPConnectionError as e:
            print(f"[!] Erro ao conectar ao RabbitMQ: {e}")
            self._connection = None
            self._channel = None

    def _reconnect(self):
        if self._connection is None or self._connection.is_closed:
            print("[!] Conexão perdida. Tentando reconectar...")
            self._connect()

    def _analyze_sentiment(self, text, trace_id):
        print(f"{trace_id} Analyzing Sentiment...")
        sentiment = setiment_service.get_sentiment(text=text, lang="pt-br")
        print(f"{trace_id} Sentiment Analised...")
        return sentiment

    def _callback(self, ch, method, properties, body):
        def process_message():
            message = json.loads(body)
            print(f"[✔] Mensagem recebida: {message}")

            text = message.get("content", "")
            trace_id = message.get("traceId", "")
            sentiment = self._analyze_sentiment(text=text, trace_id=trace_id)

            sentiment_message = {"comment": message, "sentiment": sentiment}

            self.publish(sentiment_message)

            ch.basic_ack(delivery_tag=method.delivery_tag)

        threading.Thread(target=process_message, daemon=True).start()

    def publish(self, message):
        print(f"[✔] Publicando sentimento na fila '{self._sentiments_queue}': {message}")
        if not self._connection:
            self._reconnect()
        self._channel.basic_publish(
            exchange='',
            routing_key=self._sentiments_queue,
            body=json.dumps(message),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        print(f"[✔] Sentimento publicado na fila '{self._sentiments_queue}': {message}")

    def consume(self):
        if self._channel is None:
            print("[❌] Não foi possível consumir mensagens. Canal fechado.")
            return

        print("[*] Aguardando mensagens da fila comments-queue. Pressione Ctrl+C para sair.")
        self._channel.basic_consume(queue=self._comments_queue, on_message_callback=self._callback)

        try:
            self._channel.start_consuming()
        except KeyboardInterrupt:
            print("\n[*] Interrompido pelo usuário. Fechando conexão...")
            self.close()

    def close(self):
        if self._connection and self._connection.is_open:
            self._connection.close()
            print("[*] Conexão com RabbitMQ fechada.")
