var GoalWeeklyCalculator = function(durationCalculator) {
  
  var date;
  var timeUtil;

  var init = function() {
    addBehavior();
    timeUtil = new TimeUtil();
  };

  var addBehavior = function() {
    App.dispatcher.register('DATE_CHANGED', onDateChanged);
  };

  var onDateChanged = function(data) {
    date = data.date;
  };

  var calcWeekStart = function() {
    var d = timeUtil.parseUtcYmd(date);
    if (d.getDay() != 6)
      d.setDate(d.getDate() - d.getDay());
    return d;
  };

  var extractTime = function(day) {
    var dayStr = timeUtil.getYmd(day);
    var day = App.persister.fetch(dayStr);
    return durationCalculator.calcHours(day.spans);
  };

  init();

  return {
    getTotal:function(){
      var weekStart = calcWeekStart();

      var totalTime = extractTime(weekStart);

      for (var i = 1; i < 7; i++) {
        var currDay = timeUtil.addDays(weekStart, i);
        totalTime += extractTime(currDay);
      }

      return totalTime;
    }
  };
};
