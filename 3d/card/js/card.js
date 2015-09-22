(function(_global){
  card_func = {}
  card_func.turn = function(card,side){
    card.toggleClass(side);
  }
  card_func.turncard = function(card,side){
  	console.log(card,side);
  	card.removeClass("h-flipped");
  	card.removeClass("v-flipped");
  	card.addClass(side);
  }
  window["card_func"] = card_func;
})(window)