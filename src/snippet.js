import $ from 'jquery';

$( document ).ready(function() {
	var TOTAL_SECONDS_QUERY = "mul(sum(mul(86400, day), mul(3600, hour), mul(60, minute), second),1000)";

	function updateUi(response, params){
		var cardHolder = $("#cardHolder"),
			document = response.response.docs[0],
			card = new apollo.Card(document, null);
		cardHolder.empty();
		cardHolder.append(card.createCard());
	}

	function getResult(id){
		var params = new apollo.Params();
		params.addParam("q", "id:" + id);
		params.addParam("fl", "*, totalSeconds:" + TOTAL_SECONDS_QUERY);
		apollo.search(params, updateUi);
	}

	$( document ).ready(function() {
		var params = new URLSearchParams(window.location.search),
			id = params.get("id");
		if(id){
			getResult(id);
		}
	});
});