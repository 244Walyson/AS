import pika
import json

class RabbitMQPublisher:
    def __init__(self, queue_name="sentiments-queue"):
        self._host = 'localhost'
        self._port = 5672
        self._username = 'admin'
        self._password = 'admin'
        self._queue_name = queue_name
        self._connection = None
        self._channel = None
        self._connect()

    def _connect(self):
        try:
            print("[*] Conectando ao RabbitMQ...")
            connection_params = pika.ConnectionParameters(
                host=self._host,
                port=self._port,
                credentials=pika.PlainCredentials(self._username, self._password)
            )
            self._connection = pika.BlockingConnection(connection_params)
            self._channel = self._connection.channel()

            self._channel.queue_declare(queue=self._queue_name, durable=True)

            print("[✔] Conectado ao RabbitMQ")

        except pika.exceptions.AMQPConnectionError as e:
            print(f"[!] Erro ao conectar ao RabbitMQ: {e}")
            self._connection = None
            self._channel = None

    def _reconnect(self):
        if self._connection is None or self._connection.is_closed:
            print("[!] Conexão perdida. Tentando reconectar...")
            self._connect()

    def publish(self, message):
        self._reconnect()

        if self._channel is None:
            print("[❌] Não foi possível publicar mensagem. Canal fechado.")
            return False

        try:
            self._channel.basic_publish(
                exchange='',
                routing_key=self._queue_name,
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2
                )
            )
            print(f"[✔] Mensagem publicada na fila '{self._queue_name}': {message}")
            return True

        except pika.exceptions.AMQPError as e:
            print(f"[❌] Erro ao publicar mensagem: {e}")
            return False

    def close(self):
        if self._connection and self._connection.is_open:
            self._connection.close()
            print("[*] Conexão com RabbitMQ fechada.")
