const Promise = require('bluebird');
const getTransport = require('./transport.js');
const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'ms-cli' });

const yargs = require('yargs')
  .usage('Usage: $0 --q.offset=0 --q.limit=10 -r payments.transactions.common -h rabbitmq -p 5672')

  .alias('p', 'port')
  .describe('p', 'rabbitmq port')
  .default('p', 5672)

  .alias('h', 'host')
  .describe('h', 'rabbitmq host')
  .default('h', 'localhost')

  .alias('u', 'user')
  .default('u', 'guest')
  .describe('u', 'rabbitmq user')

  .alias('P', 'password')
  .default('P', 'guest')
  .describe('P', 'rabbitmq password')

  .alias('r', 'route')
  .describe('r', 'rabbitmq routing key')
  .demand('r')

  .describe('q', 'query object')
  .default('q', {})

  .alias('t', 'timeout')
  .describe('t', 'request timeout')
  .default('t', 15000);

process.nextTick(() => {
  const argv = yargs.argv;

  // parse to JSON
  if (typeof argv.q === 'string') {
    argv.q = JSON.parse(argv.q);
  }

  log.info('sending data with %j', argv);

  // issue command
  Promise.using(getTransport(argv), amqp => (
    amqp.publishAndWait(argv.route, argv.q, { timeout: argv.timeout }).then((response) => {
      log.info(response);
    })
  ));
});
