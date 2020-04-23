var $ = require('jquery');
var cards = require('./cards.js');
var param = require('./params.js');
var search = require('./search.js');
var searchClient;

var TOTAL_SECONDS_QUERY = "mul(sum(mul(86400, day), mul(3600, hour), mul(60, minute), second),1000)";

function updateUi(response){
  var cardHolder = $("#cardHolder"),
    document = response.response.docs[0],
    card = new cards.Card(document, null);
  cardHolder.empty();
  cardHolder.append(card.createCard());
}

function getResult(id){
  searchClient =  searchClient || new search.Client();
  var params = new param.Params();
  params.addParam("q", "id:" + id);
  params.addParam("fl", "*, totalSeconds:" + TOTAL_SECONDS_QUERY);
  searchClient.search(params, updateUi);
}

document.addEventListener("DOMContentLoaded", function(event) { //your code
  var params = new URLSearchParams(window.location.search),
    id = params.get("id");
  if(id){
    getResult(id);
  }
});

exports.snippet = {
  updateUi: updateUi,
  getResult: getResult
};