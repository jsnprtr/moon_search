require('../main.js');
jest.mock('../search.js');
const search = require('../search.js');
const mockSearch = jest.fn();

beforeEach(() => {
  search.Client.mockClear();
  search.Client.mockImplementation(() => {
    return {
      search: mockSearch
    };
  });
  mockSearch.mockClear();
  mockSearch.mockReset();
});

test('Test that an initial search is made from the list of default search queries when the dom is loaded', () => {
  window.document.dispatchEvent(new Event("DOMContentLoaded", {
    bubbles: true,
    cancelable: true
  }));

  expect(mockSearch).toHaveBeenCalledTimes(1);
  const lastCall = mockSearch.mock.calls[0];
  expect(lastCall[0].getParam('q')).toEqual(expect.any(String));
});

test('Test that updateUi is called with search response, original params and any other passed parameters', () => {
  document.body.innerHTML = 
  `<div id="facets">
  </div>
  <div id="context">
  </div>
  <div id="cardHolder">
  </div>
  <div id="resultsText">
  </div>`;
  expect(document.querySelector('#resultsText').innerHTML).toMatch(/\s*\n/);
  mockSearch.mockImplementation((params, callBack) => {
    if(typeof callBack == 'function' ){
      callBack({
        response: {
          numFound: 1,
          docs: [
            {
              timestamp: '00 01 02 03',
              totalSeconds: 1445412480 + 14552880,
              transmitter: 'CC',
              id: 'someid',
              message: 'Listen, Jerry, I don’t want to overstep my bounds or anything. It’s your house. It’s your world. You’re a real Julius Caesar, but I’ll tell you some, tell you how-how I feel about school, Jerry. It’s a waste of time, a bunch of people running around, bumping into each other. G-guy up front says, “two plus two.” The people in the back say, “four.” Then the bell rings, and they give you a carton of milk and a piece of paper that says you can take a dump or something. I mean, it’s—it’s not a place for smart people, Jerry, and I know that’s not a popular opinion, but it’s my two cents on the issue.'
            }
          ]
        },
        facet_counts: {
          facet_fields: {
            transmitter: [
              'CC'
            ]
          }
        },
        highlighting: {
          someid: '<em>Julis Caesar</em>'
        }
      }, {
        getParam: () => {
          return 'query';
        }
      });
    }
  });

  window.document.dispatchEvent(new Event("DOMContentLoaded", {
    bubbles: true,
    cancelable: true
  }));

  expect(document.querySelector('#resultsText').innerHTML).toEqual(expect.any(String));
  expect(document.querySelector('#cardHolder').innerHTML).toEqual(expect.any(String));
});

test('Test scroll works downwards. When offsetHeight + scrollTop is greater than or equal to scrollHeight - 50, direction should be down', () => {
  const latestDatetime = 397092;
  document.body.innerHTML =
    `<div id="context">
      <div class="ui card" data-datetime="396990">
        first
      </div>
      <div class="ui card" data-datetime="${latestDatetime}">
        last
      </div>
    </div>`;
  window.document.dispatchEvent(new Event("DOMContentLoaded", {
    bubbles: true,
    cancelable: true
  }));

  const el = document.querySelector('#context');
  Object.defineProperty(el, 'offsetHeight', { configurable: true, value: 50 });
  Object.defineProperty(el, 'scrollTop', { configurable: true, value: 100 });
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: 150 });
  document.querySelector('#context').dispatchEvent(new Event('scroll'));

  expect(mockSearch).toHaveBeenCalledTimes(2);
  const lastCall = mockSearch.mock.calls[1];
  expect(lastCall[0].getParam('q')).toMatch('{!frange l=' + latestDatetime + ' incl=false}sum(mul(86400, day), mul(3600, hour), mul(60, minute), second)');
});

test('Test scroll works upwards. When scrollTop is less than or equal to 50, direction should be up', () => {
  const earliestDatetime = 396990;
  document.body.innerHTML =
    `<div id="context">
      <div class="ui card" data-datetime="${earliestDatetime}">
        first
      </div>
      <div class="ui card" data-datetime="397092">
        last
      </div>
    </div>`;
  window.document.dispatchEvent(new Event("DOMContentLoaded", {
    bubbles: true,
    cancelable: true
  }));

  const el = document.querySelector('#context');
  Object.defineProperty(el, 'offsetHeight', { configurable: true, value: 50 });
  Object.defineProperty(el, 'scrollTop', { configurable: true, value: 50 });
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: 250 });
  document.querySelector('#context').dispatchEvent(new Event('scroll'));

  expect(mockSearch).toHaveBeenCalledTimes(2);
  const lastCall = mockSearch.mock.calls[1];
  expect(lastCall[0].getParam('q')).toMatch('{!frange u='+ (earliestDatetime - 1) + '}sum(mul(86400, day), mul(3600, hour), mul(60, minute), second)');
});