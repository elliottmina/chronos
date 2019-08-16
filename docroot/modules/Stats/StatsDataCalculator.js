var StatsDataCalculator = function() {

  var calc = function(spans, projectCalcFunc) {
    var distribution = {};

    jQuery.each(spans, function(key, span) {
      var project = projectCalcFunc(span.project);

      if (!distribution[project])
        distribution[project] = 0;

      distribution[project] += calcHours(span);
    });

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
    calc:function(spans, projCalc) {
      return calc(spans, projCalc);
    },
    rootProjCalc: function(project) {
      var parts = project.split(/[:|\|\/]/g);
      return parts[0];
    },
    noopProjCalc: function(project) {
      return project;
    }
  };

};