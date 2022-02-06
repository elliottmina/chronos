var SpanCreatorRecentProjectBuilder = function() {

  var timeUtil;
  var dayRegression = 60;

  var init = function() {
    timeUtil = new TimeUtil();
  };

  var buildDay = function(recent, delta) {
    var date = timeUtil.addDays(new Date(), delta*-1);
    var record = App.persister.fetch(timeUtil.getLocalYmd(date));
    
    jQuery.each(record.spans, function(index, span) {
      if (jQuery.inArray(span.project, recent) == -1)
        recent.push(span.project);
    });
  };

  init();

  return {
    build:function() {
      var recent = [];
      for (var delta = 0; delta < dayRegression; delta++)
        buildDay(recent, delta);
      return recent;
    }
  };
};
