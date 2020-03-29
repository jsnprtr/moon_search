var params = require('../params.js');

test('Creates a params object', () => {
  var params = new window.apollo.Params();

  params.addParam('a', 'x');

  expect(params.getParam('a')).toBe('x');
});

test('Can overwrite existing param', () => {
  var params = new window.apollo.Params();

  params.addParam('a', 'x');
  params.addParam('a', 'y');

  expect(params.getParam('a')).toBe('y');
});

test('Builds query string', () => {
  var params = new window.apollo.Params();

  params.addParam('a', 'x');

  expect(params.buildQueryString()).toEqual('a=x');
});

test('Empty params returns nothing', () => {
  var params = new window.apollo.Params();

  expect(params.buildQueryString()).toEqual('');
});