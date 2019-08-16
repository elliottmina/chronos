var SpanCreatorTodaysProjectBuilder = function() {
  
  var date;

  var init = function() {
    addBehavior();
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
  };

  var onDateChanged = function(data) {
    date = data.date;
  };

  init();

  return {
    build:function() {
      var today = App.persister.fetch(date);
      projects = [];
      jQuery.each(today.spans, function(index, span) {
        if (jQuery.inArray(span.project, projects) == -1)
          projects.push(span.project);
      });
      return projects;
    }
  };
};
