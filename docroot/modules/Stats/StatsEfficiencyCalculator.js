var StatsEfficiencyCalculator = function() {

  var findFirstLast = function(spans) {
    var first;
    var last;
    jQuery.each(spans, function(index, span) {
      if (!first || span.start < first)
        first = span.start;
      if (!last || span.finish > last)
        last = span.finish;
    })
    return [first, last];
  };

  var calcHours = function(spans) {
    var totalMillis = 0;
    jQuery.each(spans, function(key, span) {
      totalMillis += new Date(span.finish) - new Date(span.start);
    });

    return totalMillis/1000/60/60;
  };

  return {
    calc:function(spans) {
      var first, last;
      [first, last] = findFirstLast(spans);

      if (first == undefined || last == undefined)
        return undefined;

      var elapsed = (last - first)/1000/60/60;
      var totalWorked = calcHours(spans);
      var waste = elapsed - totalWorked;

      return [totalWorked, waste];
    }
  };

};
