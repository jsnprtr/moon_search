var param = require('../params.js');

test('Creates a params object', () => {
  var params = new param.Params();

  params.addParam('a', 'x');

  expect(params.getParam('a')).toBe('x');
});

test('Can overwrite existing param', () => {
  var params = new param.Params();

  params.addParam('a', 'x');
  params.addParam('a', 'y');

  expect(params.getParam('a')).toBe('y');
});

test('Builds query string', () => {
  var params = new param.Params();

  params.addParam('a', 'x');

  expect(params.buildQueryString()).toEqual('a=x');
});

test('Mulitple queries adds \'&\' to query string', () => {
  var params = new param.Params();

  params.addParam('a', 'x');
  params.addParam('b', 'y');

  expect(params.buildQueryString()).toEqual('a=x&b=y');
});

test('Empty params returns nothing', () => {
  var params = new param.Params();

  expect(params.buildQueryString()).toEqual('');
});