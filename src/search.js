var $ = require('jquery');

var Client = function() {
  var SEARCH_HOST = __SOLRPROTOCOL__ + "://" + window.location.hostname + ":" + __SOLRPORT__,
    COLLECTION = "transcripts";

  buildQuery = function(params){
    return SEARCH_HOST + "/solr/" + COLLECTION + "/select" + "?" + params.buildQueryString();
  };

  search = function(params, callback, customParams){
    return $.get(buildQuery(params), function(response){
      if(typeof callback == 'function' ){
        callback(response, params, customParams);
      }
    });
  };
  return {
    search: search
  };
};

exports.Client = Client;