var SummaryBuilder = function() {

  var build = function(spans) {
    projects = {};
    Object.entries(spans).forEach(([key, span]) => processSpan(span, projects));
    applyRounding(projects);
    return projects;
  };

  var processSpan = function(span) {
    initProject(span, projects);
    var project = projects[getKey(span)];

    project.rawMinutes += (span.finish - span.start)/1000/60;

    span.tasks.forEach(task => {
      if (!project.tasks.includes(task))
        project.tasks.push(task);
    });
  };

  var initProject = function(span, projects) {
    if (projects[getKey(span)])
      return;

    projects[getKey(span)] = {
      label:span.project,
      rawMinutes:0,
      tasks:[]
    };
  };

  var getKey = function(span) {
    return span.project.toLowerCase();
  };

  var applyRounding = function(projects) {
    Object.entries(projects).forEach(([key, project]) => {
      project.roundedMinutes = Math.round(project.rawMinutes/15)*15;
      project.roundDelta = project.roundedMinutes - project.rawMinutes;
    });
  };

  return {
    build:build
  };
};