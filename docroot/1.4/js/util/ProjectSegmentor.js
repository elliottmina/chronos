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
    const container = jQuery('<span class="segments">');
    
    segment(project).forEach(segment => {
      const el = jQuery('<span class="segment">');
      el.append(segment);
      el.css('background-color', App.colorGenerator.generate(segment, 0.3));
      el.css('border-color', App.colorGenerator.generate(segment, 0.7));
      container.append(el);
    });

    return container;
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