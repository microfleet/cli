exports.amqp = {
  transport: {
    debug: false,
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
  debug: false,
};

exports.debug = false;
