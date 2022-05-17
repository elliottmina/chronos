var DaySummaryDataBuilder = function() {

  var projects = {};

  var processSpan = function(index, span) {
    initProject(span);

    var project = projects[getKey(span)];

    project.time += (span.finish - span.start)/1000/60;

    jQuery.each(span.tasks, function(index, task) {
      if (jQuery.inArray(task, project.tasks) == -1) {
        project.tasks.push(task);
      }
    })
  };

  var initProject = function(span) {
    if (projects[getKey(span)])
      return;

    projects[getKey(span)] = {
      label:span.project,
      time:0,
      tasks:[]
    };
  };

  var getKey = function(span) {
    return span.project.toLowerCase();
  };

  return {
    build:function(spans) {
      projects = {};
      jQuery.each(spans, processSpan);
      return projects;
    }
  }
};