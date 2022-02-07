var Stats = function() {
  
  var statsCalculator;
  var timeUtil;
  var date;
  var weekStart;
  var today;

  var dailyChart;
  var weeklyChart;

  var init = function() {
    buildDependencies();
    build();
    addBehavior();
  };

  var buildDependencies = function() {
    statsCalculator = new StatsDataCalculator();
    timeUtil = new TimeUtil();
  };

  var build = function() {
    jQuery('#Stats').html(StatsTemplate);
    dailyChart = new StatusChartBuilder(jQuery('#StatsToday .distribution'));
    weeklyChart = new StatusChartBuilder(jQuery('#StatsWeekly .distribution'));
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', updateCharts);
    App.dispatcher.subscribe('SPAN_DELETED', updateCharts);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', updateCharts);
  };

  var onDateChanged = function(data) {
    date = data.date;
    weekStart = timeUtil.getWeekStart(date);
    updateCharts();
  };

  var updateCharts = function() {
    today = App.persister.fetch(date);
    updateDay();
    updateWeek();
  };

  var updateDay = function() {
    updateDisplay(
      dailyChart,
      today.spans);
  };

  var updateWeek = function() {
    updateDisplay(
      weeklyChart,
      gatherWeekSpans());
  };

  var updateDisplay = function(chart, spans) {
    var distribution = statsCalculator.buildDistribution(spans);
    chart.render(distribution);
  };

  var gatherWeekSpans = function() {
    var spans = [];
    for (var i = 1; i < 7; i++) {
      var currDay = timeUtil.addDays(weekStart, i);
      var day = App.persister.fetch(timeUtil.getLocalYmd(currDay));

      jQuery.each(day.spans, function(index, span) {
        spans.push(span);
      });
    }
    return spans;
  };

  init();
};
