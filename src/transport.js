const Promise = require('bluebird');
const AMQPTransport = require('ms-amqp-transport');

module.exports = function disposer(host, port) {
  return AMQPTransport
    .connect({ connection: { host, port } })
    .disposer(amqp => {
      return amqp.close();
    });
};
