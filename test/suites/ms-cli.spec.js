const Promise = require('bluebird');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const diff = require('diff');
const spawn = require('child_process').execFile;

describe('ms-cli', () => {
  const binaryPath = path.resolve(__dirname, '../../bin/ms-cli.js');

  function exec(args = []) {
    return Promise.fromNode(next => (
      spawn(binaryPath, [...args], {
        timeout: 20000,
        env: process.env,
        cwd: process.cwd(),
      }, (err, stdout, stderr) => {
        if (err) {
          return next(err);
        }

        assert.equal(stderr, '');
        const lines = stdout.split('\n');
        return next(null, lines.slice(0, -1));
      })
    ));
  }

  it('performs sample request', () => {
    return exec(['-r', 'pdf.ping']).then((lines) => {
      assert.equal(lines.length, 1);
      assert.equal(lines[0], "'pong'");
      return null;
    });
  });

  it('performs pdf rendering request', () => {
    const q = {
      template: 'sample',
      context: {},
      meta: false,
    };

    const sample = fs.readFileSync(path.resolve(`${__dirname}/../sample.pdf`)).toString('base64');

    return exec(['-r', 'pdf.render', '-q', JSON.stringify(q)])
      .then((lines) => {
        assert.equal(lines.length, 1);

        const generatedPDFInBase64 = lines[0].slice(1, -1);
        const diffChars = diff.diffChars(generatedPDFInBase64, sample);

        let chars = Math.abs(generatedPDFInBase64.length - sample.length);
        diffChars.forEach((state) => {
          if (state.removed) chars += state.count;
        });

        assert.ok(chars / sample.length < 0.003, 'generated files differ too much');
        return null;
      });
  });
});
