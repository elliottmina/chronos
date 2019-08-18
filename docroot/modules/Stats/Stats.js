var Stats = function() {
  
  var chartBuilder;
  var statsCalculator;
  var colorGenerator;
  var timeUtil;
  var date;
  var weekStart;
  var showRootCharts;
  var showFullCharts;

  var dailyChart;
  var dailyRootChart;
  var weeklyChart;
  var weeklyRootChart;

  var dailyChartContainer;
  var dailyRootChartContainer;
  var weeklyChartContainer;
  var weeklyRootChartContainer;


  var init = function() {
    initSettings();
    buildDependencies();
    build();
    gatherComponents();
    updateVisibility();
    addBehavior();
    registerSettings();
  };

  var initSettings = function() {
    showRootCharts = JSON.parse(localStorage.getItem('stats_show_root_charts'));
    showFullCharts = JSON.parse(localStorage.getItem('stats_show_full_charts'));
  };

  var buildDependencies = function() {
    chartBuilder = new StatsPieChartBuilder();
    statsCalculator = new StatsDataCalculator();
    colorGenerator = new StatsColorGenerator();
    timeUtil = new TimeUtil();
  };

  var build = function() {
    jQuery('#Stats').html(StatsTemplate);
    dailyChart = chartBuilder.build('StatsTodayChart');
    dailyRootChart = chartBuilder.build('StatsTodayRootChart');
    weeklyChart = chartBuilder.build('StatsWeeklyChart');
    weeklyRootChart = chartBuilder.build('StatsWeeklyRootChart');
  };

  var gatherComponents = function() {
    dailyChartContainer = jQuery('#StatsToday');
    dailyRootChartContainer = jQuery('#StatsTodayRoot');
    weeklyChartContainer = jQuery('#StatsWeekly');
    weeklyRootChartContainer = jQuery('#StatsWeeklyRoot');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', updateCharts);
    App.dispatcher.subscribe('SPAN_DELETED', updateCharts);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', updateCharts);
  };

  var registerSettings = function() {
    App.settings.register([{
      section:'General',
      label:'Show root project charts',
      value:showRootCharts,
      type:'boolean',
      callback:onShowRootChartsChange
    },{
      section:'General',
      label:'Show full project charts',
      value:showFullCharts,
      type:'boolean',
      callback:onShowFullChartsChange
    }]);
  };

  var onShowRootChartsChange = function(newValue) {
    showRootCharts = newValue;
    localStorage.setItem('stats_show_root_charts', JSON.stringify(newValue));
    updateVisibility();
  };

  var onShowFullChartsChange = function(newValue) {
    showFullCharts = newValue;
    localStorage.setItem('stats_show_full_charts', JSON.stringify(newValue));
    updateVisibility();
  };

  var updateVisibility = function() {
    if (showFullCharts) {
      dailyChartContainer.show();
      weeklyChartContainer.show();
    } else {
      dailyChartContainer.hide();
      weeklyChartContainer.hide();
    }

    if (showRootCharts) {
      dailyRootChartContainer.show();
      weeklyRootChartContainer.show();
    } else {
      dailyRootChartContainer.hide();
      weeklyRootChartContainer.hide();
    }
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
