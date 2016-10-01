const AMQPTransport = require('ms-amqp-transport');

module.exports = function disposer({ host, port, user, password }) {
  return AMQPTransport
    .connect({ connection: { host, port, login: user, password } })
    .timeout(10000)
    .disposer(amqp => amqp.close());
};
