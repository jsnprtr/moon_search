// Add event handler
var TOTAL_SECONDS_QUERY = "mul(sum(mul(86400, day), mul(3600, hour), mul(60, minute), second),1000)";
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

$(document).bind('ajaxSend', function(event){
  //console.log('ajax sent');
});
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
	var datetime = card.dataset['datetime'];
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
		var card = new apollo.Card(results[i],
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
		var card = new apollo.Card(results[i]);
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
		if(child.dataset.datetime == totalSeconds){
			child.scrollIntoView();
		}
	});
}

function buildContextParams(datetime, direction) {
	var params = new apollo.Params();
	if(direction == "desc") {
		var range = "{!frange u=" + datetime + "}" + TOTAL_SECONDS_QUERY;
	} else {
		var range = "{!frange l=" + datetime + " incl=false}" + TOTAL_SECONDS_QUERY;
	}
	params.addParam("q", range);
	params.addParam("sort", TOTAL_SECONDS_QUERY + " " + direction);
	params.addParam("fl", "*, totalSeconds:" + TOTAL_SECONDS_QUERY);
	params.addParam("rows", 5);
	params.addParam("hl", "true");
	params.addParam("hl.fl", "message");
	return params;
}

function updateContext(results, incremental) {
	var datetime;
	if(results instanceof Array) {
		datetime = results[0].totalSeconds;
	} else {
		datetime = results.totalSeconds;
	}
	var responses = {};
	var d1, d2;
	if(!incremental) {
		d1 = apollo.search(buildContextParams(datetime, 'asc'));
		d2 = apollo.search(buildContextParams(datetime, 'desc'));
	} else {
		var direction = incremental == 'down' ? 'asc' : 'desc';
		d1 = apollo.search(buildContextParams(datetime, direction));
	}
	when = $.when(d1, d2);
	when.done(function(rs1, rs2){
		var results = [];
		if(rs2 && rs2[0].response.docs) {
			results = rs2[0].response.docs.reverse();
		}
		if(rs1 && rs1[0].response.docs) {
			results = results.concat(rs1[0].response.docs);
		}
		updateContextCards(results, datetime, incremental);
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
			checkbox.className = "ui checkbox";
			var input = document.createElement("input");
			input.setAttribute("type", "checkbox");
			input.setAttribute("name", facets.facet_fields.transmitter[i]);
			tx = facets.facet_fields.transmitter[i];
			$(checkbox).append(input);
		} else {
			var label = "<label><b>" + tx + ":</b> "  + txNames[tx] + " (" + facets.facet_fields.transmitter[i] + ")</label>";
			$(checkbox).append(label);
			facetElement.append(checkbox);
			checkbox = undefined;
		}
	}

}

// Update UI
function updateUi(response, params){
		var resultsText = getResultsText(response.response.numFound, params.getParam("q"));
		$('#resultsText').text(resultsText);
		$('#sortText').text(getSortText(params.getParam("sort")));
		$('body').attr('query', params.getParam('q'));
		updateCards(response.response.docs, response.highlighting);
		updateFacets(response.facet_counts);
		updateContext(response.response.docs);
}

function buildParams(query, sort){
	var params = new apollo.Params();
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

function doSearch(query, sort){
	apollo.search(buildParams(query, sort), updateUi);
}

function scroll(direction) {
	var ctx = $('#context');
	var card;
	if(direction == 'up'){
		card = $('#context .ui.card:first-child')[0];
		if(card) {
			var datetime = card.dataset['datetime'];
			updateContext({'totalSeconds': datetime}, direction);
		}
	} else {
		card = $('#context .ui.card:last-child')[0];
		if(card) {
			var datetime = card.dataset['datetime'];
			updateContext({'totalSeconds': datetime}, direction);
		}
	}
}

$( document ).ready(function() {
	$('#search').on('returnKey', function(event){
		doSearch($(this).val());
	});

	$('#sort').on('click', function(event) {
		doSearch($('body')[0].getAttribute('query'), event.target.getAttribute("value"));
	});

	$('#search').keyup(function(e){
		if(e.keyCode == 13){
			{
				$(this).trigger('returnKey');
			}
		}
	});
	$('#searchButton').on('click',function(event){
		doSearch(event.toElement.parentElement.getElementsByTagName('input')[0].value);
	});
	$('#context').on('scroll', function(event) {
		var o = event.target;
		if(o.offsetHeight + o.scrollTop >= o.scrollHeight - 100){
			scroll('down');
		}

		if(o.scrollTop == 0) {
			scroll('up');
		}
	});
	var searchQueries = [
		"\"oval room\"",
		"\"eagle has landed\"",
		"babe",
		"\"magnificent desolation\"",
		"\"one giant leap for mankind\""
	];
	doSearch(searchQueries[Math.floor(Math.random() * searchQueries.length)]);
});
