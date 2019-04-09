// Add event handler

$(document).bind('ajaxSend', function(event){
  console.log('ajax sent');
})
// Get resultstext
function getResultsText(numFound, input){
	var results = "results";
	if(numFound == 1){
		results = "result";
	}
	return "Got " + numFound + " " + results + " for query: '" + input + "'";
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
		updateCards(response.response.docs, response.highlighting);
		updateFacets(response.facet_counts);
}

// Update cards
function updateCards(results, highlight){
	var cardHolder = $('#cardHolder');
	cardHolder.empty();
	for(var i = 0; i < results.length; i++){
		var card = new apollo.Card(results[i],
			highlight[results[i].id].message[0]);
		cardHolder.append(card.createCard());
	}
}

function buildParams(query){
	var params = new apollo.Params();
	params.addParam("q", query);
	params.addParam("q.op", "and");
	params.addParam("hl", "true");
	params.addParam("hl.fl", "message");
	params.addParam("facet", "true");
	params.addParam("facet.field", "transmitter");
	params.addParam("df", "message");
	return params;
}

function doSearch(query){
	apollo.search(buildParams(query), updateUi);
}

$( document ).ready(function() {
	$('#search').on('returnKey', function(event){
          ga('send', {
            hitType: 'event',
            eventCategory: 'Search',
            eventAction: 'returnKey',
            eventLabel: $(this).val() 
          });
		doSearch($(this).val());
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
	var searchQueries = [
		"\"oval room\"",
		"\"eagle has landed\"",
		"babe",
		"\"magnificent desolation\"",
		"\"one giant leap for mankind\""
	];
	doSearch(searchQueries[Math.floor(Math.random() * searchQueries.length)]);
});
