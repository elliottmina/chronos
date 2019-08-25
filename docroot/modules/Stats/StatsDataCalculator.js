var StatsDataCalculator = function() {

  var buildDistribution = function(spans) {
    var distribution = {};

    jQuery.each(spans, function(key, span) {
      var project = App.projectSegmentor.segment(span.project)[0];
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
    calc:buildKeysValues,
    buildDistribution:buildDistribution
  };

};