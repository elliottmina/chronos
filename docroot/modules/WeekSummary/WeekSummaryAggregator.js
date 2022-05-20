var WeekSummaryAggregator = function(timeUtil) {

  var aggregate = function(weekStart) {
    const spans = gatherSpans(weekStart);
    if (!spans.length)
      return;

    var data = {};
    spans.forEach(span => {
      const project = App.projectSegmentor.segment(span.project)[0];
      data[project] = data[project] || 0;
      data[project] += elapsedMinutes(span);
    });

    return data;
  };


  var gatherSpans = function(weekStart) {
    var spans = [];
    for (var i = 0; i < 7; i++) {
      var currDay = timeUtil.addDays(weekStart, i);
      var day = App.persister.fetch(timeUtil.getLocalYmd(currDay));

      jQuery.each(day.spans, function(index, span) {
        spans.push(span);
      });
    }
    return spans;
  };

  var elapsedMinutes = function(span) {
    return (new Date(span.finish) - new Date(span.start))/1000/60;
  };

  return {
    aggregate:aggregate
  };

};