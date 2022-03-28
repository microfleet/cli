const assert = require('assert')
const path = require('path')
const spawn = require('util').promisify(require('child_process').execFile)

describe('ms-cli', () => {
  const binaryPath = path.resolve(__dirname, '../../bin/ms-cli.mjs')

  async function exec(args = []) {
    const { stdout, stderr } = await spawn(binaryPath, [...args], {
      timeout: 10000,
      env: process.env,
      cwd: process.cwd(),
    })

    assert.equal(stderr, '', stderr)
    const lines = stdout.split('\n')
    return lines.slice(0, -1)
  }

  it('performs sample request', async () => {
    const lines = await exec(['-r', 'users.generic.health'])
    assert.equal(lines.length, 1)
    const line = JSON.parse(lines[0])
    assert.equal(line.data.failed.length, 0)
    assert.equal(line.data.alive.length, 2)
    assert.equal(line.data.status, 'ok')
  })

  it('prints complex object', async () => {
    const [out] = await exec(['-r', 'users.register-fake-users', '-q.amount', '1'])
    const output = JSON.parse(out)
    assert(output.length, 1)
    assert(output[0].jwt)
    assert(output[0].user)
    assert.equal(output[0].user.metadata['*.localhost'].test, true)
  })
})
