import { pino } from 'pino'
import { getClient } from './transport.mjs'
import * as conf from 'ms-conf'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// set default namespace
process.env.NCONF_NAMESPACE = process.env.NCONF_NAMESPACE || 'MS_CLI'

const config: any = conf.get('/amqp/transport/connection', { env: process.env.NODE_ENV })
const log = pino({ name: '@microfleet/cli', level: conf.get('/debug') ? 'trace' : 'info' })

log.trace({ config }, 'default amqp config')

const argv = await yargs(hideBin(process.argv))
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
    type: 'string',
    describe: 'rabbitmq routing key',
    demandOption: true,
  })
  .option('query', {
    alias: 'q',
    describe: 'query object',
    coerce(data: Record<string, any> | string = "{}"): Record<string, any> {
      return typeof data === 'string' ? JSON.parse(data) : data
    }
  })
  .option('timeout', {
    alias: 't',
    describe: 'request timeout',
    default: 15000,
  })
  .config(config)
  .help('help')
  .argv


log.trace({ argv }, 'connecting & making request')
const amqp = await getClient(argv)

try {
  const response = await amqp.publishAndWait(argv.route, argv.query, { timeout: argv.timeout })
  process.stdout.write(JSON.stringify(response))
  process.stdout.write('\n')
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err)
} finally {
  await amqp.close()
}
