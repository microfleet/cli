const Promise = require('bluebird');
const bunyan = require('bunyan');
const conf = require('ms-conf');
const getTransport = require('./transport');

// set default namespace
process.env.NCONF_NAMESPACE = process.env.NCONF_NAMESPACE || 'MS_CLI';

const config = conf.get('/amqp/transport/connection', { env: process.env.NODE_ENV });
const log = bunyan.createLogger({
  name: '@microfleet/cli',
  level: conf.get('/debug') ? 'trace' : 'info',
  stream: process.stderr,
});

log.trace({ config }, 'default amqp config');

const argv = require('yargs')
  .usage('Usage: $0 --q.offset=0 --q.limit=10 -r payments.transactions.common')
  .option('port', {
    alias: 'p',
    describe: 'rabbitmq port',
    default: 5672,
  })
  .option('host', {
    alias: 'h',
    describe: 'rabbitmq host',
    default: 'localhost',
  })
  .option('login', {
    alias: 'l',
    default: 'guest',
    describe: 'rabbitmq user',
  })
  .option('password', {
    alias: 'P',
    default: 'guest',
    describe: 'rabbitmq password',
  })
  .option('route', {
    alias: 'r',
    describe: 'rabbitmq routing key',
    demandOption: true,
  })
  .option('query', {
    alias: 'q',
    describe: 'query object',
    default: {},
  })
  .option('timeout', {
    alias: 't',
    describe: 'request timeout',
    default: 15000,
  })
  .config(config)
  .help('help')
  .argv;

// parse to JSON
if (typeof argv.q === 'string') {
  argv.q = JSON.parse(argv.q);
}

log.trace('sending data with', argv);

// issue command
Promise.using(getTransport(argv), amqp => (
  amqp
    .publishAndWait(argv.route, argv.q, { timeout: argv.timeout })
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log('%j', response);
      return null;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      return null;
    })
));
