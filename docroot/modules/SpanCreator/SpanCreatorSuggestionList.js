var SpanCreatorSuggestionList = function(
  regEx, 
  input, 
  list, 
  treatmentApplicator,
  template) {

  var index;
  var showing = false;
  var suggestions;

  var init = function() {
    addBehavior();
  };

  var addBehavior = function() {
    input.focus(considerShowing);
    input.blur(onBlur);
    input.keyup(onKeyUp);
  };

  var considerShowing = function() {
    const filteredSuggestions = getFilteredSuggestions();
    if (filteredSuggestions.length == 0) {
      hide();
      return;
    }
    populate(filteredSuggestions);
    show();
  };

  var hide = function() {
    if(!showing)
      return;

    deselectAll();
    list.hide();
    showing = false;
  };

  var show = function() {
    if (showing)
      return;

    treatmentApplicator.apply(list);
    list.show();
    showing = true;
  };

  var populate = function(suggestions) {
    list.empty();
    suggestions.map(populateSuggestion);
    selectFirst();
  };

  var populateSuggestion = function(suggestion) {
    var li = jQuery(template)
      .clone()
      .appendTo(list)
      .click(onSelectionClick);

    li.find('.text').text(suggestion)
  };

  var onBlur = function() {
    setTimeout(hide, 200);
  };

  var onKeyUp = function(e) {
    switch (e.key) {
      case 'Enter':
        if (showing) {
          e.stopImmediatePropagation();
          useSelected();
        }
        break;
      case 'Escape':
        hide();
        break;
      case 'ArrowUp':
        selectUp();
        break;
      case 'ArrowDown':
        selectDown();
        break;
      default:
        considerShowing();
    }
  };

  var selectUp = function() {
    ensureShowing();

    index--;
    index = Math.max(index, 0);
    showSelected();
  };

  var selectDown = function() {
    index++;
    index = Math.min(index, getFilteredSuggestions().length -1);
    showSelected();
  };

  var selectFirst = function() {
    index = 0;
    showSelected();
  };

  var showSelected = function() {
    deselectAll();
    list.find('li').eq(index).addClass('selected');
  };

  var deselectAll = function() {
    list.find('.selected').removeClass('selected');
  };

  var useSelected = function() {
    input.val(list.find('.selected').find('.text').text());
    hide();
    input.change();
  };

  var ensureShowing = function() {
    if (list.is(':hidden'))
      show();
  };

  var onSelectionClick = function() {
    input.val(jQuery(this).find('.text').text());
    hide();
    input.change();
    input.focus();
  };

  var getFilteredSuggestions = function() {
    var inputText = input.val().toLowerCase();
    if (inputText == '')
      return suggestions;

    var re = regEx.squishyMatch(inputText);
    var filteredSuggestions = [];
    suggestions.forEach(project => {
      if (re.test(project.toLowerCase()))
        filteredSuggestions.push(project);
    });
    return filteredSuggestions;
  };

  init();

  return {
    setSuggestions:function(newSuggestions) {
      suggestions = newSuggestions;
    }
  }
};
