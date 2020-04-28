function TimeLineParser(timeLine) {

  function parseTimeLine(totalSeconds) {
    var keys = Object.keys(timeLine);
    var state = {};
    for(var i = 0; i < keys.length; i++) {
      state = timeLine[keys[i]];
      
      if (totalSeconds <= parseInt(keys[i])) {
        break;
      } else if (totalSeconds > keys[i]) {
        state = {};
      }
    }
    return state && state.label ? state.label : "";
  }

  /*
  * Gets the current state of the mission from the totalSeconds
  */
  function getMissionState(totalSeconds) {
    if (totalSeconds < 0) {
      return "";
    }
    return parseTimeLine(totalSeconds);
  }

  return {
    getMissionState: getMissionState
  };
}

exports.TimeLineParser = TimeLineParser;