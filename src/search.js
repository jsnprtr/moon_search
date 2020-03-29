import $ from 'jquery';
import '../semantic/dist/semantic.css';

window.apollo = window.apollo || {};

window.apollo.SEARCH_HOST = "http://" + window.location.hostname + ":8983";
window.apollo.COLLECTION = "transcripts";

window.apollo.buildQuery = function(params){
	return this.SEARCH_HOST + "/solr/" + this.COLLECTION + "/select" + "?" + params.buildQueryString();
};

window.apollo.search = function(params, callback){
        gtag('event', 'search_made', {
          'event_category': 'Search',
          'event_label': params.getParam('q')
        });
	return $.get(this.buildQuery(params), function(response){
		if(typeof callback == 'function' ){
			callback(response, params);
		}
	});
};