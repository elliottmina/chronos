var StatsDataCalculator = function() {
  
  return {
    calc:function(spans) {
      var distribution = {};

      jQuery.each(spans, function(key, span) {
        if (!distribution[span.project])
          distribution[span.project] = 0;

        var milliDelta = new Date(span.finish) - new Date(span.start);
        var hourDelta = milliDelta/1000/60/60;
        
        distribution[span.project] += hourDelta;
      });

      var keys = [];
      var values = [];
      jQuery.each(distribution, function(k, v) {
        keys.push(k);
        values.push(v.toFixed(2));
      })

      return [keys, values];
    }
  };

};