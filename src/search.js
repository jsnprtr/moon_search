import $ from 'jquery';
import '../my-semantic-theme/semantic.less';

window.apollo = window.apollo || {};

window.apollo.SEARCH_HOST = __SOLRPROTOCOL__ + "://" + window.location.hostname + ":" + __SOLRPORT__;
window.apollo.COLLECTION = "transcripts";

window.apollo.buildQuery = function(params){
	return this.SEARCH_HOST + "/solr/" + this.COLLECTION + "/select" + "?" + params.buildQueryString();
};

window.apollo.search = function(params, callback, customParams){
	return $.get(this.buildQuery(params), function(response){
		if(typeof callback == 'function' ){
			callback(response, params, customParams);
		}
	});
};