window.apollo = window.apollo || {};

window.apollo.SEARCH_HOST = "http://" + window.location.host + ":8983";
window.apollo.COLLECTION = "transcripts";

window.apollo.buildQuery = function(params){
	return this.SEARCH_HOST + "/solr/" + this.COLLECTION + "/select" + "?" + params.buildQueryString();
};

window.apollo.search = function(params, callback){
        gtag('event', 'search_made', {
          'event_category': 'Search',
          'event_label': params.getParam('q')
        });
	$.get(this.buildQuery(params), function(response){
		if(response !== undefined){
			callback(response, params);
		}
	});
};
