var StatsDataCalculator = function() {

  var calc = function(spans, projectCalcFunc) {
    var distribution = buildDistribution(spans, projectCalcFunc);
    return buildKeysValues(distribution);
  };

  var buildDistribution = function(spans, projectCalcFunc) {
    var distribution = {};

    jQuery.each(spans, function(key, span) {
      var project = projectCalcFunc(span.project);
      initProject(distribution, project);
      distribution[project] += calcHours(span);
    });

    return distribution;
  };

  var initProject = function(distribution, project) {
    if (!distribution[project])
      distribution[project] = 0;
  };

  var buildKeysValues = function(distribution) {
    var keys = [];
    var values = [];
    jQuery.each(distribution, function(k, v) {
      keys.push(k);
      values.push(v.toFixed(2));
    });

    return [keys, values];
  };

  var calcHours = function(span) {
    var milliDelta = new Date(span.finish) - new Date(span.start);
    return milliDelta/1000/60/60;
  };

  return {
    calc:calc,
    rootProjCalc: function(project) {
      return App.projectSegmentor.segment(project)[0];
    },
    noopProjCalc: function(project) {
      return project;
    }
  };

};