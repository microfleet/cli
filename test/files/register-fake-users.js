const { timesLimit } = require('async')
const { faker } = require('@faker-js/faker');
const { v4 } = require('uuid');

/**
 * @this {Microfleet}
 */
async function registerFakeUsers({ params }) {
  const { amount } = params
  const { config } = this;

  const audience = config.jwt.defaultAudience;

  return timesLimit(amount, Math.min(30, amount), async () => {
    const username = v4()
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const metadata = {
      firstName,
      lastName,
      test: true,
    }

    const message = {
      username,
      audience,
      metadata,
      activate: true,
      skipPassword: true,
    }

    return this.dispatch('register', { params: message })
  })
}

module.exports = registerFakeUsers
