const snippet = require('../snippet.js');

jest.mock('../cards.js');
jest.mock('../params.js');
const mockCreateCard = jest.fn();
mockCreateCard.mockReturnValue('appended');
const mockAddParam = jest.fn();
const cards = require('../cards.js');
const param = require('../params.js');

const $ = require('jquery');

const mockParams = {
  addParam: mockAddParam
};

global.apollo = {
  search: jest.fn()
};

beforeEach(() => {
  cards.Card.mockClear();
  cards.Card.mockImplementation(() => {
    return {
      createCard: mockCreateCard
    };
  });
  param.Params.mockClear();
  param.Params.mockImplementation(() => {
    return mockParams;
  });
  apollo.search.mockClear();
});

test('Should create a card with the first document from the response object', () => {
  document.body.innerHTML =
    '<div id="cardHolder">' +
    '</div>';

  const mockDoc = {documentId: 1};
  const response = {
    response: {
      docs: [
        mockDoc
      ]
    }
  };

  expect(cards.Card).not.toHaveBeenCalled();
  
  snippet.snippet.updateUi(response);

  expect(cards.Card).toHaveBeenCalledWith(mockDoc, null);
  expect(cards.Card).toHaveBeenCalledTimes(1);
  expect(mockCreateCard).toHaveBeenCalledTimes(1);
  expect($('#cardHolder')[0].innerHTML).toEqual('appended');

});

test('Should call search with params object using id as query', () => {
  const id = 'id';

  snippet.snippet.getResult(id);

  expect(mockAddParam).toHaveBeenCalledTimes(2);
  expect(apollo.search).toHaveBeenCalledTimes(1);
  expect(apollo.search).toHaveBeenCalledWith(mockParams, snippet.snippet.updateUi);


});

test('Should call getResult on document ready and make a search with updateUi function', () => {
  document.body.innerHTML =
    '<div id="cardHolder">' +
    '</div>';

  delete window.location;
  window.location = { search: "?id=test"};
  window.document.dispatchEvent(new Event("DOMContentLoaded", {
    bubbles: true,
    cancelable: true
  }));

  expect(apollo.search).toHaveBeenCalledTimes(1);
  expect(apollo.search).toHaveBeenCalledWith(mockParams, snippet.snippet.updateUi);

});