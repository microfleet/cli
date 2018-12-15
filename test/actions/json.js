/**
 * Sample action that returns complex object on any input
 * @returns {object}
 */
function json() {
  return {
    foo: {
      bar: {
        baz: [{
          foo: { bar: 'baz' },
          bar: { baz: 'foo', bar: [1, 2, 3] },
        }],
      },
    },
  };
}

json.schema = 'ping';

module.exports = json;
