var $ = require('jquery');
require('./cookieconsent.js');
var Client = require('./search.js').Client;
var Card = require('./cards.js').Card;
var Params = require('./params.js').Params;

var CardParser = require('./cardparser.js').CardParser;
var timelineupdatetimeout;

var timeLine = require('./timeline.js');
var TimeLineParser = require('./timelineparser.js').TimeLineParser;

var searchClient;

var TOTAL_SECONDS_QUERY = "sum(mul(86400, day), mul(3600, hour), mul(60, minute), second)";
var sortMap = {
	"time": {
		"name": "Time",
		"value": TOTAL_SECONDS_QUERY
	},
	"score": {
		"name": "Relevance",
		"value": "score"
	}
};

// Get resultstext
function getResultsText(numFound, input){
	var results = "results";
	if(numFound == 1){
		results = "result";
	}
	return "Got " + numFound + " " + results + " for query: '" + input + "'";
}

function getSortText(sortParam) {
	sortParam = sortParam || "score desc";
	return "Sorted by: " + sortParam;
}

function clickEvent(event) {
	var ctx = $('#cardHolder');
	var children = ctx.children();
	children.each(function(index, child) {
		child.classList.remove('selected');
	});
	var card = $(event.target).closest('.card')[0];
	card.classList.add('selected');
	var datetime = card.dataset.datetime;
	updateContext({'totalSeconds': Number.parseFloat(datetime)});
}

// Update cards
function updateCards(results, highlight){
	var cardHolder = $('#cardHolder');
	cardHolder.empty();
	for(var i = 0; i < results.length; i++){
		var highlightForResult = highlight[results[i].id];
		var highlightMessage = undefined;
		if(highlightForResult && highlightForResult.message && highlightForResult.message.length > 0) {
			highlightMessage = highlightForResult.message[0];
		}
		var card = new Card(results[i],
			highlightMessage);
		if(i == 0){
			card.addClass('selected');
		}
		cardHolder.append(card.createCard(clickEvent));
	}
}

function updateContextCards(results, totalSeconds, incremental) {
	var ctx = $('#context');
	if(!incremental){
		ctx.empty();
	}
	var selected = results.length - 6;
	for(var i = 0; i < results.length; i++) {
		var card = new Card(results[i]);
		if(results[i].totalSeconds == totalSeconds && !incremental) {
			card.addClass('selected');
		}
		if(incremental == 'up'){
			ctx.prepend(card.createCard());
		} else {
			ctx.append(card.createCard());
		}
	}
	ctx.children().each(function(index, child){
		if(child.dataset.datetime == totalSeconds && !incremental){
			child.scrollIntoView();
		}
	});
}

function buildContextParams(datetime, direction) {
	var params = new Params();
	var range;
	if(direction == "desc") {
		range = "{!frange u=" + datetime + "}" + TOTAL_SECONDS_QUERY;
	} else {
		range = "{!frange l=" + datetime + " incl=false}" + TOTAL_SECONDS_QUERY;
	}
	params.addParam("q", range);
	params.addParam("sort", TOTAL_SECONDS_QUERY + " " + direction);
	params.addParam("fl", "*, totalSeconds:" + TOTAL_SECONDS_QUERY);
	params.addParam("rows", 5);
	params.addParam("hl", "true");
	params.addParam("hl.fl", "message");
	return params;
}

function updateContext(results, incremental, callBack) {
	var datetime;
	if(results instanceof Array) {
		datetime = results[0].totalSeconds;
	} else {
		datetime = results.totalSeconds;
	}
	var responses = {};
	var d1, d2;
	if(!incremental) {
		d1 = searchClient.search(buildContextParams(datetime, 'asc'));
		d2 = searchClient.search(buildContextParams(datetime, 'desc'));
	} else {
		var direction = incremental == 'down' ? 'asc' : 'desc';
		if(direction == 'desc') {
			datetime -= 1;
		}
		d1 = searchClient.search(buildContextParams(datetime, direction));
	}
	var when = $.when(d1, d2);
	when.done(function(rs1, rs2){
		var results = [];
		if(rs2 && rs2[0].response.docs) {
			results = rs2[0].response.docs.reverse();
		}
		if(rs1 && rs1[0].response.docs) {
			results = results.concat(rs1[0].response.docs);
		}
		updateContextCards(results, datetime, incremental);
		if(callBack) {
			callBack();
		}
	});
}

//Update facets
function updateFacets(facets){
	var txNames = {
		"PRESIDENT NIXON": "President Nixon",
		"CC": "Capsule Communicator",
		"CDR": "Commander: Neil A. Armstrong",
		"CMP": "Command module pilot: Michael Collins",
		"CMP/LMP": "CMP/LMP",
		"CT": "Communications Technician",
		"HORNET": "USS Hornet",
		"LMP": "Lunar Module Pilot: Edwin E. Aldrin, Jr (Buzz)",
		"MS": "Multiple / simultaneous speakers",
		"MSFN": "Manned Space Flight Network",
		"MUS": "Music",
		"SC": "Unidentifiable crewmember",
		"SWIM 1": "Swim team (recovery)",
		"UNK": "Unknown"
	};
	var facetElement = $("#facets");
	facetElement.empty();
	var checkbox;
	for(var i = 0; i < facets.facet_fields.transmitter.length; i++){
		var tx;
		if(i === 0 || i % 2 === 0){
			checkbox = document.createElement("div");
			tx = facets.facet_fields.transmitter[i];
		} else {
			var label = "<label><b>" + tx + ":</b> "  + txNames[tx] + " (" + facets.facet_fields.transmitter[i] + ")</label>";
			$(checkbox).append(label);
			facetElement.append(checkbox);
			checkbox = undefined;
		}
	}

}

/*
* sends a 'search_made' event to GA with the query as the event label
*/
function trackRequest(query) {
  gtag('event', 'search_made', {
	  'event_category': 'Search',
	  'event_label': query
	});
}

// Update UI
function updateUi(response, params, customParams){
	var resultsText = getResultsText(response.response.numFound, params.getParam("q"));
	if(customParams && customParams.trackRequest) {
		trackRequest(params.getParam("q"));
	}
	$('#resultsText').text(resultsText);
	$('body').attr('query', params.getParam('q'));
	updateCards(response.response.docs, response.highlighting);
	updateFacets(response.facet_counts);
	updateContext(response.response.docs);
}

function changeSortText(event) {
	$('#sortText').text(getSortText(event.target.dataset.label));
}

function buildParams(query, sort){
	var params = new Params();
	params.addParam("q", query);
	params.addParam("q.op", "and");
	params.addParam("hl", "true");
	params.addParam("hl.fl", "message");
	params.addParam("facet", "true");
	params.addParam("facet.field", "transmitter");
	params.addParam("df", "message");
	params.addParam("fl", "*, totalSeconds:" + TOTAL_SECONDS_QUERY);
	if(sort) {
		params.addParam("sort", sort);
	}
	return params;
}

function updateLocation(query) {
	var url = new URL(window.location.href);
	url.searchParams.delete('q');
	url.searchParams.append("q", query);
	history.pushState({}, document.title, url.toString());
}

function doSearch(query, sort, track){
	if(!searchClient) {
		searchClient = new Client();
	}
	updateLocation(query);
	searchClient.search(buildParams(query, sort), updateUi, {trackRequest: track});
}

function scroll(direction) {
	var selector;
	if(direction == 'up'){
		selector = 'first';
	} else {
		selector = 'last';
	}
	var card = $('#context .ui.card:' + selector + '-child')[0];
	if(card) {
		var datetime = card.dataset.datetime;
		updateContext({'totalSeconds': datetime}, direction, reAttachScrollEvent);
	}
}

function updateTimeline() {
	var context = $('#context');
	var cp = new CardParser(context);
	var topScroll = cp.getTopScrollCard(context[0]);
	var tlp = new TimeLineParser(timeLine.timeLine);
	var missionState = tlp.getMissionState(parseInt(topScroll.dataset.datetime));
	$('#timeline')[0].innerText = missionState;
}

function reAttachScrollEvent() {
	$('#context').on('scroll', scrollEvent);
}

function scrollEvent(event) {
	var o = event.target;
	if(o.scrollTop <= 50) {
		$(o).off('scroll',scrollEvent);
		scroll('up');
	} else if(o.offsetHeight + o.scrollTop >= o.scrollHeight - 50){
		$(o).off('scroll',scrollEvent);
		scroll('down');
	}

	if(timelineupdatetimeout) {
		window.clearTimeout(timelineupdatetimeout);

	}

	timelineupdatetimeout = window.setTimeout(function() {
		updateTimeline();
	}, 500);
}

function initialSearch() {
	var searchQueries = [
		"\"oval room\"",
		"\"eagle has landed\"",
		"babe",
		"\"magnificent desolation\"",
		"\"one giant leap for mankind\"",
		"\"oatmeal\"",
		"\"meatballs\"",
		"\"Music Out of the Moon\"",
		"\"Keep the mice healthy.\"",
		"\"remember to come in BEF.\""
	],
		params = new URLSearchParams(window.location.search),
    q = params.get("q");

  var searchQuery = q || searchQueries[Math.floor(Math.random() * searchQueries.length)];

	doSearch(searchQuery);
}

document.addEventListener("DOMContentLoaded", function(){
	$('#search').on('returnKey', function(event){
		doSearch($(this).val(), undefined, true);
	});

	$('#sort').on('click', function(event) {
		doSearch($('body')[0].getAttribute('query'), event.target.getAttribute("value"));
		changeSortText(event);
	});

	$('#search').keyup(function(e){
		if(e.keyCode == 13){
			{
				$(this).trigger('returnKey');
			}
		}
	});
	$('#searchButton').on('click',function(event){
		doSearch(event.target.parentElement.getElementsByTagName('input')[0].value, undefined, true);
	});
	
	$('#context').on('scroll', scrollEvent);

	initialSearch();
});
