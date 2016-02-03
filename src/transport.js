const AMQPTransport = require('ms-amqp-transport');

module.exports = function disposer(host, port) {
  return AMQPTransport
    .connect({ connection: { host, port } })
    .timeout(10000)
    .disposer(amqp => amqp.close());
};
