var SpanCreatorShortcuts = function(
  projectSuggestor, 
  save, 
  saveAndRepeat,
  startTimeField, 
  finishTimeField,
  taskList) {

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
    var topContainer = jQuery('#SpanCreator');
    topContainer.find('.toggle_hotkeys').click(toggleDisplay);
    topContainer.find('.save')
      .click(save)
      .keyup(onSaveKeyUp);
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
        taskList.focus();
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

  var toggleDisplay = function() {
    container.toggle();
    if (container.css('display') == 'block')
      buttonIcon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
    else
      buttonIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
  };

  init();

};
