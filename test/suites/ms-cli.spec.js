const assert = require('assert');
const path = require('path');
const fs = require('fs').promises;
const diff = require('diff');
const spawn = require('util').promisify(require('child_process').execFile);

describe('ms-cli', () => {
  const binaryPath = path.resolve(__dirname, '../../bin/ms-cli.js');

  async function exec(args = []) {
    const { stdout, stderr } = await spawn(binaryPath, [...args], {
      timeout: 20000,
      env: process.env,
      cwd: process.cwd(),
    });

    assert.equal(stderr, '');
    const lines = stdout.split('\n');
    return lines.slice(0, -1);
  }

  it('performs sample request', async () => {
    const lines = await exec(['-r', 'pdf.ping']);
    assert.equal(lines.length, 1);
    assert.equal(lines[0], '"pong"');
  });

  it('prints complex object', async () => {
    const [out] = await exec(['-r', 'pdf.json']);
    assert(JSON.parse(out));
  });

  it('performs pdf rendering request', async () => {
    const q = {
      template: 'sample',
      context: {},
      meta: false,
    };

    const sample = await fs.readFile(path.resolve(`${__dirname}/../sample.pdf`), 'base64');
    const lines = await exec(['-r', 'pdf.render', '-q', JSON.stringify(q)]);

    assert.equal(lines.length, 1);

    const generatedPDFInBase64 = lines[0].slice(1, -1);
    const diffChars = diff.diffChars(generatedPDFInBase64, sample);

    let chars = Math.abs(generatedPDFInBase64.length - sample.length);
    diffChars.forEach((state) => {
      if (state.removed) chars += state.count;
    });

    try {
      assert.ok(chars / sample.length < 0.003, `generated files differ too much: ${chars} / ${sample.length}`);
    } finally {
      await fs.writeFile(path.resolve(`${__dirname}/../sample-fail.pdf`), generatedPDFInBase64, 'base64');
    }
  });
});
