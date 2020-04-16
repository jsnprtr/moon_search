window.apollo = window.apollo || {};

window.apollo.Params = function(){
  var params = new Map();
  
  var addParam =  function(name, val){
    params.set(name, val);
  };

  var getParam = function(name){
    return params.get(name);
  };

  var buildQueryString = function(){
    return Array.from(params.entries()).map(
      function(entry) {
        return entry[0] + "=" + entry[1];
      }).join('&');
  };

  return {getParam: getParam,
      addParam: addParam,
      buildQueryString: buildQueryString};
};

exports.Params = window.apollo.Params;