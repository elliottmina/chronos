var Stats = function() {
  
  var chartBuilder;
  var statsCalculator;
  var colorGenerator;
  var timeUtil;
  var date;
  var weekStart;
  var dailyChart;
  var weeklyChart;

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
    weeklyChart = chartBuilder.build('StatusWeeklyChart');
    // project, project:task

  };

  var addBehavior = function() {
    App.dispatcher.register('DATE_CHANGED', onDateChanged);
    App.dispatcher.register('SPAN_SAVED', updateCharts);
    App.dispatcher.register('SPAN_DELETED', updateCharts);
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
    updateChart(dailyChart, today.spans);
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
    updateChart(weeklyChart, spans);
  };

  var updateChart = function(chart, spans) {
    var kv = statsCalculator.calc(spans);
    var labels = kv[0];
    var values = kv[1];

    chart.data.datasets[0].data = values;
    chart.data.datasets[0].backgroundColor = colorGenerator.generate(labels);
    chart.data.labels = labels;
    chart.update();
  }

  init();
};
