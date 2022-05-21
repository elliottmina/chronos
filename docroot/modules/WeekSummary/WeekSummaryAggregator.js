var WeekSummaryAggregator = function(timeUtil, summaryBuilder) {

  var aggregate = function(weekStart) {
    const projects = gatherTotals(weekStart);
    projects.sort((a, b) => b.rawMinutes - a.rawMinutes);
    return reduce(projects);
  };

  var gatherTotals = function(weekStart) {
    var projectMap = {};
    for (var i = 0; i < 7; i++) {
      const summaries = getDaySummaries(weekStart, i);
      Object.entries(summaries).forEach(([key, summary]) => {
        accumulate(key, summary, projectMap);
      });
    }
    return Object.values(projectMap);
  };

  var getDaySummaries = function(weekStart, dayOffset) {
    var currDay = timeUtil.addDays(weekStart, dayOffset);
    var day = App.persister.fetch(timeUtil.getLocalYmd(currDay));
    return summaryBuilder.build(day.spans);
  };

  var accumulate = function(key, summary, projectMap) {
    key = key.toLowerCase();
    initProject(key, summary, projectMap);

    projectMap[key].rawMinutes += summary.rawMinutes;
    projectMap[key].roundedMinutes += summary.roundedMinutes;
    projectMap[key].roundDelta += summary.roundDelta;
  };

  var initProject = function(key, summary, projectMap) {
    if (projectMap[key])
      return;

    projectMap[key] = {
      label:summary.label,
      rawMinutes:0,
      roundedMinutes:0,
      roundDelta:0,
    };
  };

  var reduce = function(projects) {
    if (projects.length <= 5)
      return projects;

    const reduced = projects.splice(0, 5);

    reduced.push({
      label: 'Misc',
      rawMinutes:     projects.reduce((total, project) => total+project.rawMinutes,     0),
      roundedMinutes: projects.reduce((total, project) => total+project.roundedMinutes, 0),
      roundDelta:     projects.reduce((total, project) => total+project.roundDelta,     0),
    });

    return reduced;
  };

  return {
    aggregate:aggregate
  };

};