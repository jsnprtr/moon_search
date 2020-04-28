function CardParser(cardList) {

  function getTopScrollCard(context) {
    var scroll = context.scrollTop;
    var cards = cardList.find('.ui.card');
    if(cards.length === 1 || scroll == 0) {
      return cards[0];
    }
    var card;
    for(var i = 0; i < cards.length; i++) {
      var element = cards[i];
      if(element.offsetTop >= scroll) {
        break;
      }
      card = element;
    }
    return card;
  }

  return {
    getTopScrollCard: getTopScrollCard
  };
}

exports.CardParser = CardParser;