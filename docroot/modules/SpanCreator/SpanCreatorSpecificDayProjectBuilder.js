var SpanCreatorSpecificDayProjectBuilder = function() {
  
  var date;

  return {
    setDate:function(newDate) {
      date = newDate;
    },
    build:function() {
      var today = App.persister.fetch(date);
      projects = [];
      jQuery.each(today.spans, function(index, span) {
        if (jQuery.inArray(span.project, projects) == -1)
          projects.push(span.project);
      });
      projects.sort();
      return projects;
    }
  };
};
