const {CardParser} = require('../cardparser.js');


test(`Returns card at the top of the scroll box`, () => {

  const cards =
    {
      find: () => {
        return [
            {offsetTop: 0, dataset: {datetime: 0}},
            {offsetTop: 100, dataset: {datetime: 100}},
            {offsetTop: 200, dataset: {datetime: 200}},
            {offsetTop: 300, dataset: {datetime: 300}}
          ];
      }
    };

  const parser = new CardParser(cards);

  const context = {
      scrollTop: 250
  };

  const card = parser.getTopScrollCard(context);

  expect(card.dataset.datetime).toEqual(200);
});

test(`Returns undefined if card list is empty`, () => {

  const cards =
    {
      find: () => {
        return [
            
          ];
      }
    };

  const parser = new CardParser(cards);

  const context = {
      scrollTop: 250
  };

  const card = parser.getTopScrollCard(context);

  expect(card).toBe(undefined);
});

test(`Returns first card if scrollTop is 0`, () => {

  const cards =
    {
      find: () => {
        return [
            
          ];
      }
    };

  const parser = new CardParser(cards);

  const context = {
      scrollTop: 0
  };

  const card = parser.getTopScrollCard(context);

  expect(card).toBe(undefined);
});