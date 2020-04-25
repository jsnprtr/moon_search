const cards = require('../cards.js');

const $ = require('jquery');

test(`It should create a card object with:
  - timestamp
  - date from totalSeconds
  - transmitter
  - link to snippet with id
  - highlight text should replace message text`, () => {
  
  const mockDoc = {
    timestamp: '00 01 02 03',
    totalSeconds: 1445412480 + 14552880,
    transmitter: 'Rick',
    id: 'someid',
    message: 'If I die in a cage I lose a bet'
  };
  
  const card = new cards.Card(mockDoc, 'If I die in a <em>cage</em> I lose a bet');
  
  const cardHtml = card.createCard();

  expect(cardHtml.outerHTML).toMatch("<div class=\"ui card\" data-datetime=\"1459965360\"><div class=\"content\"><b>Time (day, hour, minute, second): </b>00 01 02 03<br><b>Time (UTC): </b>Oct 21, 2015, 7:28:00 AM<a href=\"snippet.html?id=someid\" target=\"_blank\"><i class=\"external share icon\"></i></a><br><b>Rick: </b>If I die in a <em>cage</em> I lose a bet</div></div>");
});

test(`It should create a card object without fulltext if there's not highlight
  (uses message for the full message text)`, () => {
    const mockDoc = {
    timestamp: '00 01 02 03',
    totalSeconds: 1445412480 + 14552880,
    transmitter: 'Rick',
    id: 'someid',
    message: 'If I die in a cage I lose a bet'
  };
  
  const card = new cards.Card(mockDoc, null);

  const cardHtml = card.createCard();

  expect(cardHtml.outerHTML).toMatch("<div class=\"ui card\" data-datetime=\"1459965360\"><div class=\"content\"><b>Time (day, hour, minute, second): </b>00 01 02 03<br><b>Time (UTC): </b>Oct 21, 2015, 7:28:00 AM<a href=\"snippet.html?id=someid\" target=\"_blank\"><i class=\"external share icon\"></i></a><br><b>Rick: </b>If I die in a cage I lose a bet</div></div>");
});

test(`It should allow you to add classes to the surrounding div
  Also tests that adding subsequent classes won't affect previously created cards`, () => {
  const mockDoc = {
    timestamp: '00 01 02 03',
    totalSeconds: 1445412480 + 14552880,
    transmitter: 'Rick',
    id: 'someid',
    message: 'If I die in a cage I lose a bet'
  };
  
  const card = new cards.Card(mockDoc, 'If I die in a <em>cage</em> I lose a bet');

  card.addClass('testClass123');

  const card1 = card.createCard();
  expect(card1.classList).toContain('testClass123');
  card.addClass('testClass456');
  expect(card1.classList).not.toContain('testClass456');

  expect(card.createCard().classList).toContain('testClass456');
});

test(`That a card with a highlight which is a smaller part of the full text
  shows the full text in a 'show more' div.
  Highlight matches the final part of the full message so only preceeding ellipses are shown`, () => {
  const mockDoc = {
    timestamp: '00 01 02 03',
    totalSeconds: 1445412480 + 14552880,
    transmitter: 'Rick',
    id: 'someid',
    message: 'Listen, Jerry, I don’t want to overstep my bounds or anything. It’s your house. It’s your world. You’re a real Julius Caesar, but I’ll tell you some, tell you how-how I feel about school, Jerry. It’s a waste of time, a bunch of people running around, bumping into each other. G-guy up front says, “two plus two.” The people in the back say, “four.” Then the bell rings, and they give you a carton of milk and a piece of paper that says you can take a dump or something. I mean, it’s—it’s not a place for smart people, Jerry, and I know that’s not a popular opinion, but it’s my two cents on the issue.'
  };
  
  const card = new cards.Card(mockDoc, 'but it’s my <em>two cents</em> on the issue.');

  const cardHtml = card.createCard();

  expect(cardHtml.outerHTML).toMatch("<div class=\"ui card\" data-datetime=\"1459965360\"><div class=\"content\"><b>Time (day, hour, minute, second): </b>00 01 02 03<br><b>Time (UTC): </b>Oct 21, 2015, 7:28:00 AM<a href=\"snippet.html?id=someid\" target=\"_blank\"><i class=\"external share icon\"></i></a><br><b>Rick: </b>... but it’s my <em>two cents</em> on the issue.</div><div class=\"extra content\"></div><div class=\"content\" style=\"display:none;\"><b>Time (day, hour, minute, second): </b>00 01 02 03<br><b>Time (UTC): </b>Oct 21, 2015, 7:28:00 AM<a href=\"snippet.html?id=someid\" target=\"_blank\"><i class=\"external share icon\"></i></a><br><b>Rick: </b>Listen, Jerry, I don’t want to overstep my bounds or anything. It’s your house. It’s your world. You’re a real Julius Caesar, but I’ll tell you some, tell you how-how I feel about school, Jerry. It’s a waste of time, a bunch of people running around, bumping into each other. G-guy up front says, “two plus two.” The people in the back say, “four.” Then the bell rings, and they give you a carton of milk and a piece of paper that says you can take a dump or something. I mean, it’s—it’s not a place for smart people, Jerry, and I know that’s not a popular opinion, but it’s my <em>two cents</em> on the issue.</div></div>");
});

test(`That a card with a highlight which is a smaller part of the full text
  shows the full text in a 'show more' div.
  Highlight matches the beginning part of the full message so only proceeding ellipses are shown`, () => {
  const mockDoc = {
    timestamp: '00 01 02 03',
    totalSeconds: 1445412480 + 14552880,
    transmitter: 'Rick',
    id: 'someid',
    message: 'Listen, Jerry, I don’t want to overstep my bounds or anything. It’s your house. It’s your world. You’re a real Julius Caesar, but I’ll tell you some, tell you how-how I feel about school, Jerry. It’s a waste of time, a bunch of people running around, bumping into each other. G-guy up front says, “two plus two.” The people in the back say, “four.” Then the bell rings, and they give you a carton of milk and a piece of paper that says you can take a dump or something. I mean, it’s—it’s not a place for smart people, Jerry, and I know that’s not a popular opinion, but it’s my two cents on the issue.'
  };
  
  const card = new cards.Card(mockDoc, 'Listen, Jerry, I don’t want to <em>overstep</em> my bounds or anything.');

  const cardHtml = card.createCard();

  expect(cardHtml.outerHTML).toMatch("<div class=\"ui card\" data-datetime=\"1459965360\"><div class=\"content\"><b>Time (day, hour, minute, second): </b>00 01 02 03<br><b>Time (UTC): </b>Oct 21, 2015, 7:28:00 AM<a href=\"snippet.html?id=someid\" target=\"_blank\"><i class=\"external share icon\"></i></a><br><b>Rick: </b>Listen, Jerry, I don’t want to <em>overstep</em> my bounds or anything....</div><div class=\"extra content\"></div><div class=\"content\" style=\"display:none;\"><b>Time (day, hour, minute, second): </b>00 01 02 03<br><b>Time (UTC): </b>Oct 21, 2015, 7:28:00 AM<a href=\"snippet.html?id=someid\" target=\"_blank\"><i class=\"external share icon\"></i></a><br><b>Rick: </b>Listen, Jerry, I don’t want to <em>overstep</em> my bounds or anything. It’s your house. It’s your world. You’re a real Julius Caesar, but I’ll tell you some, tell you how-how I feel about school, Jerry. It’s a waste of time, a bunch of people running around, bumping into each other. G-guy up front says, “two plus two.” The people in the back say, “four.” Then the bell rings, and they give you a carton of milk and a piece of paper that says you can take a dump or something. I mean, it’s—it’s not a place for smart people, Jerry, and I know that’s not a popular opinion, but it’s my two cents on the issue.</div></div>");
});

test(`That a card with a highlight which is a smaller part of the full text
  shows the full text in a 'show more' div.
  Highlight matches a middle part of the full message so preceeding and proceeding ellipses are shown`, () => {
  const mockDoc = {
    timestamp: '00 01 02 03',
    totalSeconds: 1445412480 + 14552880,
    transmitter: 'Rick',
    id: 'someid',
    message: 'Listen, Jerry, I don’t want to overstep my bounds or anything. It’s your house. It’s your world. You’re a real Julius Caesar, but I’ll tell you some, tell you how-how I feel about school, Jerry. It’s a waste of time, a bunch of people running around, bumping into each other. G-guy up front says, “two plus two.” The people in the back say, “four.” Then the bell rings, and they give you a carton of milk and a piece of paper that says you can take a dump or something. I mean, it’s—it’s not a place for smart people, Jerry, and I know that’s not a popular opinion, but it’s my two cents on the issue.'
  };
  
  const card = new cards.Card(mockDoc, 'a piece of paper that says you can <em>take a dump</em> or something');

  const cardHtml = card.createCard();

  expect(cardHtml.outerHTML).toMatch("<div class=\"ui card\" data-datetime=\"1459965360\"><div class=\"content\"><b>Time (day, hour, minute, second): </b>00 01 02 03<br><b>Time (UTC): </b>Oct 21, 2015, 7:28:00 AM<a href=\"snippet.html?id=someid\" target=\"_blank\"><i class=\"external share icon\"></i></a><br><b>Rick: </b>... a piece of paper that says you can <em>take a dump</em> or something...</div><div class=\"extra content\"></div><div class=\"content\" style=\"display:none;\"><b>Time (day, hour, minute, second): </b>00 01 02 03<br><b>Time (UTC): </b>Oct 21, 2015, 7:28:00 AM<a href=\"snippet.html?id=someid\" target=\"_blank\"><i class=\"external share icon\"></i></a><br><b>Rick: </b>Listen, Jerry, I don’t want to overstep my bounds or anything. It’s your house. It’s your world. You’re a real Julius Caesar, but I’ll tell you some, tell you how-how I feel about school, Jerry. It’s a waste of time, a bunch of people running around, bumping into each other. G-guy up front says, “two plus two.” The people in the back say, “four.” Then the bell rings, and they give you a carton of milk and a piece of paper that says you can <em>take a dump</em> or something. I mean, it’s—it’s not a place for smart people, Jerry, and I know that’s not a popular opinion, but it’s my two cents on the issue.</div></div>");
});

test(`That the 'show more' button works as it should on long messages`, () => {
  const mockDoc = {
    timestamp: '00 01 02 03',
    totalSeconds: 1445412480 + 14552880,
    transmitter: 'Rick',
    id: 'someid',
    message: 'Listen, Jerry, I don’t want to overstep my bounds or anything. It’s your house. It’s your world. You’re a real Julius Caesar, but I’ll tell you some, tell you how-how I feel about school, Jerry. It’s a waste of time, a bunch of people running around, bumping into each other. G-guy up front says, “two plus two.” The people in the back say, “four.” Then the bell rings, and they give you a carton of milk and a piece of paper that says you can take a dump or something. I mean, it’s—it’s not a place for smart people, Jerry, and I know that’s not a popular opinion, but it’s my two cents on the issue.'
  };
  
  const card = new cards.Card(mockDoc, 'a piece of paper that says you can <em>take a dump</em> or something');

  const cardObj = card.createCard();

  expect($(cardObj).find('.extra.content')[0].innerText).toMatch('show more');

  $(cardObj).find('.extra.content').click();

  expect($(cardObj).find('.extra.content')[0].innerText).toMatch('show less');

  $(cardObj).find('.extra.content').click();

  expect($(cardObj).find('.extra.content')[0].innerText).toMatch('show more');


});

test(`It should create a card object with no link text`, () => {
  
  const mockDoc = {
    timestamp: '00 01 02 03',
    totalSeconds: 1445412480 + 14552880,
    transmitter: 'Rick',
    id: 'someid',
    message: 'If I die in a cage I lose a bet'
  };
  
  const card = new cards.Card(mockDoc, 'If I die in a <em>cage</em> I lose a bet');
  card.setNoLink();
  
  const cardHtml = card.createCard();

  expect(cardHtml.outerHTML).toMatch("<div class=\"ui card\" data-datetime=\"1459965360\"><div class=\"content\"><b>Time (day, hour, minute, second): </b>00 01 02 03<br><b>Time (UTC): </b>Oct 21, 2015, 7:28:00 AM<br><b>Rick: </b>If I die in a <em>cage</em> I lose a bet</div></div>");
});