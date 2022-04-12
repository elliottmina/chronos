var StatsDataCalculator = function() {

  var buildDistribution = function(spans) {
    var distribution = {};

    jQuery.each(spans, function(key, span) {
      var project = App.projectSegmentor.segment(span.project)[0];
      initProject(distribution, project);
      distribution[project] += calcHours(span);
    });

    var list = Object.entries(distribution);
    list.sort((a, b) => {
      return b[1] - a[1];
    });

    return list;
  };

  var initProject = function(distribution, project) {
    if (!distribution[project])
      distribution[project] = 0;
  };

  var calcHours = function(span) {
    var milliDelta = new Date(span.finish) - new Date(span.start);
    return milliDelta/1000/60/60;
  };

  return {
    buildDistribution:buildDistribution
  };

};