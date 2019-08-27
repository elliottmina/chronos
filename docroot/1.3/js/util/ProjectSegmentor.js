var ProjectSegmentor = function() {
  
  var regEx;

  var init = function() {
    buildDependencies();
    buildMatcher();
    addBehavior();
  };

  var buildDependencies = function() {
    regEx = new RegEx();
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('PROJECT_DELIMITERS_CHANGED', onProjectDelimiterChanged);
  };

  var onProjectDelimiterChanged = function() {
    buildMatcher();
    App.dispatcher.publish('PROJECT_SEGMENTOR_CHANGED');
  };

  var segment = function(project) {
    if (!re)
      return [project];
    return project.split(re);
  };

  var getFormatted = function(project) {
    var segments = segment(project);
    var parts = [];
    
    for (var i = 0, j = 1; i < segments.length; i++, j++)
      parts.push(addMarkup(segments[i], j));
    
    return parts.join('<span class="segment_separator fal fa-angle-right"></span>');
  };

  var addMarkup = function(text, num) {
    return '<span class="segment segment_' + num + '">' + text + '</span>';
  };

  var buildMatcher = function() {
    var chars = App.globalSettings.project_delimiters;
    if (chars.trim() == '')
      re = undefined;
    else
      re = regEx.delimiter(chars);
  };

  init();

  return {
    segment:segment,
    getFormatted:getFormatted
  };

};