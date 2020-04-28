const {TimeLineParser} = require('../timelineparser.js');

test('Given a negative number, returns empty string', () => {

  const tl = new TimeLineParser();

  const state = tl.getMissionState(-1);

  expect(state).toMatch("");
});

test(`Given a timeline, get the corresponding state
  - timeline keys are seconds "up to including"`, () => {
  const timeLine = {
    1000: {
      label: "early"
    },
    2000: {
      label: "Launch"
    },
    4000: {
      label: "Orbit"
    },
    6000: {
      label: "Lunch"
    }
  };

  const tl = new TimeLineParser(timeLine);

  const launchStateToo = tl.getMissionState(1999);

  expect(launchStateToo).toMatch(timeLine['2000'].label);

  const launchState = tl.getMissionState(2000);

  expect(launchState).toMatch(timeLine['2000'].label);

  const orbitState = tl.getMissionState(2001);

  expect(orbitState).toMatch(timeLine['4000'].label);

  const lunchState = tl.getMissionState(5999);

  expect(lunchState).toMatch(timeLine['6000'].label);

  expect(tl.getMissionState(10000)).toMatch("");

});

test(`Given a timeline, get the corresponding state
  - returns an empty string if the totalSeconds is greater than the keys`, () => {
  const timeLine = {
    2000: {
      label: "Launch"
    },
    4000: {
      label: "Orbit"
    },
    6000: {
      label: "Lunch"
    }
  };

  const tl = new TimeLineParser(timeLine);

  expect(tl.getMissionState(10000)).toMatch("");

});