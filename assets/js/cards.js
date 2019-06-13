window.apollo = window.apollo || {};

window.apollo.Card = function(doc, highlight){
	var timestamp = doc.timestamp,
		totalSeconds = doc.totalSeconds,
 		message = getMessage(doc.message, highlight),
		tx = doc.transmitter,
		id = doc.id;

	function addClass(className) {
		this.classNames = this.classNames || [];
		this.classNames.push(className);
	}


	// Get message with ellipses or not
	function getMessage(message, highlight){
		var retMessage = {text: "",
		fullText: undefined};
		retMessage.text = highlight || message;
		if(highlight){
			var shortText = highlight.replace(/<\/?em>/g, "");
			if(shortText.length != message.length){
				if(message.indexOf(shortText) > 0){
					retMessage.text = "... " + highlight;
				}
				if(message.indexOf(shortText.substr(shortText.length - (shortText.length - 5), shortText.length)) + (shortText.length - 5) != message.length){
					retMessage.text = retMessage.text + "...";
				}
				retMessage.fullText = message.replace(shortText, highlight);
			}
		}

		return retMessage;
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

	//create Content
	function createContent(timestamp, message, tx, totalSeconds){
		content = document.createElement("div");
		content.className = "content";
		var utc = new Date();
		totalSeconds = -14552880000 + totalSeconds;
		utc.setTime(totalSeconds);
		content.innerHTML = "<b>Time (day, hour, minute, second): </b>" + 
					timestamp + 
					"<br>" + 
					"<b>Time (UTC): </b>" +
					utc.toGMTString() +
					"<a href=\"snippet.html?id=" + id +"\" target=\"_blank\">" +
					"<i class=\"external share icon\"></i>" +
					"</a>" +
					"<br>" + 
					"<b>" + tx + ": </b>" + 
					message;
		
		return content;
	}

	function createCard(clickEvent){
		var card = document.createElement("div"),
			content = createContent(timestamp, message.text, tx, totalSeconds);
		card.className = "ui card";
		$(card).append(content);
		if(message.fullText){
			var hiddenContent = createContent(timestamp, message.fullText, tx, totalSeconds);
				showMoreElement = document.createElement('div');
			hiddenContent.setAttribute("style", "display:none;");
			showMoreElement.className = "extra content";
			showMoreElement.innerText = "show more";
			$(showMoreElement).on("click", showMore);
			card.append(showMoreElement);
			card.append(hiddenContent);
		}
		$(card).on('click', clickEvent);
		for(var index in this.classNames) {
			card.classList.add(this.classNames[index]);
		}
		card.dataset['datetime'] = totalSeconds;
		return card;
	}
	return {
		createCard: createCard,
		addClass: addClass
	};
};
