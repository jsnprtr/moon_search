var $ = require('jquery');
var Message = require('./messageutils.js').Message;

window.apollo = window.apollo || {};

window.apollo.Card = function(doc, highlight){
	var timestamp = doc.timestamp,
		totalSeconds = doc.totalSeconds,
 		message = new Message(doc.message, highlight).getMessage(),
		tx = doc.transmitter,
		id = doc.id;

	function addClass(className) {
		this.classNames = this.classNames || [];
		this.classNames.push(className);
	}

	//show more
	function showMore(element){
		var showMore = "show more",
			contentHolders = $(this.parentElement).find('div:not(.extra)');
		$.each(contentHolders, function(index, content){
			$(content).toggle();
		});
		if(this.innerText == showMore){
			this.innerText = "show less";
		} else {
			this.innerText = showMore;
		}
	}

	function getDateFromSeconds() {
		var utc = new Date();
		offsetSeconds = -14552880 + totalSeconds;
		utc.setTime(offsetSeconds * 1000);
		return Intl.DateTimeFormat('en-GB',{
			dateStyle: "medium",
			timeStyle: "medium",
			timeZone: "utc"
			}).format(utc);
	}

	//create Content
	function createContent(text){
		var content = document.createElement("div");
		content.className = "content";
		content.innerHTML = "<b>Time (day, hour, minute, second): </b>" + 
		timestamp + 
		"<br>" + 
		"<b>Time (UTC): </b>" +
		getDateFromSeconds() +
		"<a href=\"snippet.html?id=" + id +"\" target=\"_blank\">" +
		"<i class=\"external share icon\"></i>" +
		"</a>" +
		"<br>" + 
		"<b>" + tx + ": </b>" + 
		text;
		
		return content;
	}

	function createShowMoreElement() {
		var showMoreElement = document.createElement('div');
		showMoreElement.className = "extra content";
		showMoreElement.innerText = "show more";
		$(showMoreElement).on("click", showMore);
		return showMoreElement;
	}

	function createHiddenContent() {
		var hiddenContent = createContent(message.fullText);
		hiddenContent.setAttribute("style", "display:none;");
		return hiddenContent;
	}

	function createCard(clickEvent){
		var card = document.createElement("div"),
			content = createContent(message.text);
		card.className = "ui card";
		$(card).append(content);
		if(message.fullText){
			var showMoreElement = createShowMoreElement(),
				hiddenContent = createHiddenContent();
			card.append(showMoreElement);
			card.append(hiddenContent);
		}
		$(card).on('click', clickEvent);
		for(var index in this.classNames) {
			card.classList.add(this.classNames[index]);
		}
		card.dataset.datetime = totalSeconds;
		return card;
	}
	return {
		createCard: createCard,
		addClass: addClass
	};
};

exports.Card = window.apollo.Card;
