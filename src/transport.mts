import { connect } from '@microfleet/transport-amqp'

export const getClient = ({ host, port, login, password, debug = false, log = undefined }) => {
  return connect({
    timeout: 10 * 1e3,
    debug,
    log,
    privateQueueOpts: {
      exclusive: true,
      durable: false,
      autoDelete: true,
    },
    dlx: {
      enabled: false,
    },
    connection: {
      host,
      port,
      login,
      password,
    },
  })
}
