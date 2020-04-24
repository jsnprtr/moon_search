// These must be defined before search is loaded
global.__SOLRPROTOCOL__ = "test";
global.__SOLRPORT__ = '0000';
const search = require('../search.js');
const $ = require('jquery');

jest.mock('../params.js');
const param = require('../params.js');
const mockParams = {
  buildQueryString: jest.fn()
};

beforeEach(() => {
  param.Params.mockClear();
  param.Params.mockImplementation(() => {
    return mockParams;
  });
});

const fakeResponse = {
  id: 1,
  name: 'Rick',
  value: 'C130'
};

beforeAll(() => {
  $.get = jest.fn().mockImplementation((url, callBack) => {
    callBack(fakeResponse);
  });
});

test(`Should do a search and call the callBack with the response
  - Should pass customParams as undefined if none are available`, () => {
  const searchClient = new search.Client();
  const myParams = new param.Params();
  const callBack = jest.fn();
  const promise = searchClient.search(myParams, callBack);

  expect(callBack).toHaveBeenCalledTimes(1);
  expect(callBack).toHaveBeenCalledWith(fakeResponse, myParams, undefined);
});

test(`Should do a search and call the callBack with the response
  - Should pass customParams if they are available`, () => {
  const searchClient = new search.Client();
  const myParams = new param.Params();
  const callBack = jest.fn();
  const customParams = {
    1: 'a',
    2: 'b'
  };
  const promise = searchClient.search(myParams, callBack, customParams);

  expect(callBack).toHaveBeenCalledTimes(1);
  expect(callBack).toHaveBeenCalledWith(fakeResponse, myParams, customParams);
});

test(`Should not call callBack if it is not a function`, () => {
  const searchClient = new search.Client();
  const myParams = new param.Params();
  const callBack = {};
  const promise = searchClient.search(myParams, callBack);

  // Does nothing

});