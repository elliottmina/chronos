var Stats = function() {
  
  var chartBuilder;
  var statsCalculator;
  var colorGenerator;
  var timeUtil;
  var date;
  var weekStart;
  var dailyChart;
  var dailyRootChart;
  var weeklyChart;
  var weeklyRootChart

  var init = function() {
    buildDependencies();
    build();
    addBehavior();
  };

  var buildDependencies = function() {
    chartBuilder = new StatsPieChartBuilder();
    statsCalculator = new StatsDataCalculator();
    colorGenerator = new StatsColorGenerator();
    timeUtil = new TimeUtil();
  };

  var build = function() {
    jQuery('#Stats').html(StatsTemplate);
    dailyChart = chartBuilder.build('StatusTodayChart');
    dailyRootChart = chartBuilder.build('StatusTodayRootChart');
    weeklyChart = chartBuilder.build('StatusWeeklyChart');
    weeklyRootChart = chartBuilder.build('StatusWeeklyRootChart');

  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', updateCharts);
    App.dispatcher.subscribe('SPAN_DELETED', updateCharts);
  };

  var onDateChanged = function(data) {
    date = data.date;
    weekStart = timeUtil.getWeekStart(date);
    updateCharts();
  };

  var updateCharts = function() {
    updateToday();
    updateWeek();
  }

  var updateToday = function() {
    var today = App.persister.fetch(date);
    updateChart(dailyChart, today.spans, statsCalculator.noopProjCalc);
    updateChart(dailyRootChart, today.spans, statsCalculator.rootProjCalc);
  };

  var updateWeek = function() {
    var spans = [];
    for (var i = 1; i < 7; i++) {
      var currDay = timeUtil.addDays(weekStart, i);
      var day = App.persister.fetch(timeUtil.getYmd(currDay));
      jQuery.each(day.spans, function(index, span) {
        spans.push(span);
      });
    }
    updateChart(weeklyChart, spans, statsCalculator.noopProjCalc);
    updateChart(weeklyRootChart, spans, statsCalculator.rootProjCalc);
  };

  var updateChart = function(chart, spans, projCalcFunc) {
    var kv = statsCalculator.calc(spans, projCalcFunc);
    var labels = kv[0];
    var values = kv[1];

    chart.data.datasets[0].data = values;
    chart.data.datasets[0].backgroundColor = colorGenerator.generate(labels);
    chart.data.labels = labels;
    chart.update();
  }

  init();
};
