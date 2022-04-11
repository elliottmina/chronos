var SpanCreatorShortcuts = function(
  projectSuggestor, 
  save, 
  saveAndRepeat,
  startTimeField, 
  finishTimeField,
  taskSuggestor) {

  var keyEvaluator;
  var container;
  var buttonIcon;

  var init = function() {
    buildDependencies();
    gatherComponents();
    addBehavior();
  };

  var buildDependencies = function() {
    keyEvaluator = new MetaKeyEvaluator();
  };

  var gatherComponents = function() {
    var topContainer = jQuery('#SpanCreator');
    container = topContainer.find('.hotkeys');
    buttonIcon = topContainer.find('.toggle_hotkeys i');
  };
  
  var addBehavior = function() {
    jQuery(document).keydown(onKeyDown);
  };

  var onKeyDown = function(e) {
    switch (keyEvaluator.get(e)) {

      case 'ENTER':
        stopPropagation(e);
        e.shiftKey ? saveAndRepeat() : save();
        return;
  
      case 'J':
        stopPropagation(e);
        projectSuggestor.focus();
        return;
  
      case 'K':
        stopPropagation(e);
        startTimeField.focus();
        return;
  
      case 'L':
        stopPropagation(e);
        taskSuggestor.focus();
        return;

      case ';':
        stopPropagation(e);
        finishTimeField.focus();
        return;
    }
  };

  var stopPropagation = function(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  var onSaveKeyUp = function(e) {
    if (e.key == 'Enter' || e.key == ' ')
      save();
  };

  init();

};
