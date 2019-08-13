var GoalSpanDurationCalculator = function() {
  
  return {
    calcHours:function(spans) {
      var totalMillis = 0;
      jQuery.each(spans, function(key, span) {
        totalMillis += new Date(span.finish) - new Date(span.start);
      });

      return totalMillis/1000/60/60;
    }
  };

};
