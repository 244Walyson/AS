import pika
import json

class RabbitMQConsumer:
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
            print("[*] Conectando ao RabbitMQ para consumir mensagens...")
            connection_params = pika.ConnectionParameters(
                host=self._host,
                port=self._port,
                credentials=pika.PlainCredentials(self._username, self._password)
            )
            self._connection = pika.BlockingConnection(connection_params)
            self._channel = self._connection.channel()
            self._channel.queue_declare(queue=self._queue_name, durable=True)

            print("[✔] Conectado ao RabbitMQ como consumidor.")

        except pika.exceptions.AMQPConnectionError as e:
            print(f"[!] Erro ao conectar ao RabbitMQ: {e}")
            self._connection = None
            self._channel = None

    def _callback(self, ch, method, properties, body):
        message = json.loads(body)
        print(f"[✔] Mensagem recebida: {message}")

        ch.basic_ack(delivery_tag=method.delivery_tag)

    def consume(self):
        if self._channel is None:
            print("[❌] Não foi possível consumir mensagens. Canal fechado.")
            return

        print("[*] Aguardando mensagens. Pressione Ctrl+C para sair.")
        self._channel.basic_consume(queue=self._queue_name, on_message_callback=self._callback)

        try:
            self._channel.start_consuming()
        except KeyboardInterrupt:
            print("\n[*] Interrompido pelo usuário. Fechando conexão...")
            self.close()

    def close(self):
        if self._connection and self._connection.is_open:
            self._connection.close()
            print("[*] Conexão com RabbitMQ fechada.")
