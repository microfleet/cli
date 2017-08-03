exports.amqp = {
  transport: {
    connection: {
      host: 'rabbitmq',
      port: 5672,
      login: 'guest',
      password: 'guest',
    },
  },
};

exports.logger = {
  defaultLogger: true,
  debug: true,
};

exports.debug = false;
