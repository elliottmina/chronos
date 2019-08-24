var Stats = function() {
  
  var chartBuilder;
  var statsCalculator;
  var colorGenerator;
  var timeUtil;
  var efficiencyCalculator;
  var date;
  var weekStart;
  var today;

  var dailyRootChart;
  var weeklyRootChart;
  var efficiencyChart;

  var dailyRootChartContainer;
  var weeklyRootChartContainer;
  var efficiencyChartContainer;

  var init = function() {
    buildDependencies();
    build();
    gatherComponents();
    addBehavior();
  };

  var buildDependencies = function() {
    chartBuilder = new StatsPieChartBuilder();
    statsCalculator = new StatsDataCalculator();
    colorGenerator = new StatsColorGenerator();
    timeUtil = new TimeUtil();
    efficiencyCalculator =  new StatsEfficiencyCalculator();
  };

  var build = function() {
    jQuery('#Stats').html(StatsTemplate);
    dailyRootChart = chartBuilder.build('StatsTodayRootChart');
    weeklyRootChart = chartBuilder.build('StatsWeeklyRootChart');
    efficiencyChart = chartBuilder.build('StatsEfficiencyChart');
    
    efficiencyChart.data.labels = ['Work', 'Waste'];
    efficiencyChart.data.datasets[0].backgroundColor = ['#fb6c3b', '#5e2473'];
  };

  var gatherComponents = function() {
    dailyRootChartContainer = jQuery('#StatsTodayRoot');
    weeklyRootChartContainer = jQuery('#StatsWeeklyRoot');
    efficiencyChartContainer = jQuery('#StatsEfficiency');
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
    updateChart(dailyRootChart, today.spans, statsCalculator.rootProjCalc);
    updateWeek();
    updateEfficiency();
  }

  var updateWeek = function() {
    var spans = [];
    for (var i = 1; i < 7; i++) {
      var currDay = timeUtil.addDays(weekStart, i);
      var day = App.persister.fetch(timeUtil.getYmd(currDay));
      jQuery.each(day.spans, function(index, span) {
        spans.push(span);
      });
    }
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
  };

  var updateEfficiency = function() {
    result = efficiencyCalculator.calc(today.spans);
    if (result == undefined) {
      efficiencyChartContainer.hide();
      return;
    }

    var totalWorked, waste;
    [totalWorked, waste] = result;

    efficiencyChartContainer.show();
    efficiencyChart.data.datasets[0].data = [totalWorked.toFixed(2), waste.toFixed(2)];
    efficiencyChart.update();
  };

  init();
};
