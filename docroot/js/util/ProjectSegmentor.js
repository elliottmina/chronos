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

    const parts = segment(project);

    const icon = jQuery('<i class="icon fas fa-folder-open"></i>');
    icon.css('color', App.colorGenerator.generate(parts[0], 1));
    icon.css('border-color', App.colorGenerator.generate(parts[0], 1));
    icon.css('background-color', App.colorGenerator.generate(parts[0], 0.1));
    container.append(icon);

    parts.forEach((segment, index, array) => {
      const el = jQuery('<span class="segment">');
      el.append(segment);
      container.append(el);

      if (array.length > 1 && index != array.length-1)
        container.append('<i class="segment_separator fas fa-caret-right"></i>');
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