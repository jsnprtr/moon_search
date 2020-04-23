var Message = function(message, highlight) {
  this.message = message;
  this.highlight = highlight;

  /*
  * Gets the excerpt from the highlight (add ellipses if needed)
  */
  function getExcerpt(shortText) {
    var excerpt = highlight;
    if(message.indexOf(shortText) > 0){
      excerpt = "... " + excerpt;
    }

    if(message.indexOf(shortText) != message.length - shortText.length){
      excerpt += "...";
    }
    return excerpt;
  }


  /**
  * With the given message and highlight, return a message object with:
  * - text: the original text to display (the highlight or the whole message)
  * - fullText: the full text from the message
  **/
  function getMessage() {
    var retMessage = {};
    retMessage.text = highlight || message;
    if(highlight){
      var shortText = highlight.replace(/<\/?em>/g, "");
      if(shortText.length != message.length){
        retMessage.text = getExcerpt(shortText);
        retMessage.fullText = message.replace(shortText, highlight);
      }
    }

    return retMessage;
  }

  return {
    getMessage: getMessage
  };

};


exports.Message = Message;