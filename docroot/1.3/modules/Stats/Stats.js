var Stats = function() {
  
  var chartBuilder;
  var statsCalculator;
  var timeUtil;
  var efficiencyCalculator;
  var legendBuilder;
  var date;
  var weekStart;
  var today;

  var dailyChart;
  var weeklyChart;
  var efficiencyChart;

  var dailyChartContainer;
  var weeklyChartContainer;
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
    timeUtil = new TimeUtil();
    efficiencyCalculator =  new StatsEfficiencyCalculator();
    legendBuilder = new StatsLegendBuilder();
  };

  var build = function() {
    jQuery('#Stats').html(StatsTemplate);
    dailyChart = chartBuilder.build('StatsTodayRootChart');
    weeklyChart = chartBuilder.build('StatsWeeklyRootChart');
    efficiencyChart = chartBuilder.build('StatsEfficiencyChart');
    
    var data = efficiencyChart.data;
    data.labels = ['Work', 'Waste'];
    data.datasets[0].backgroundColor = ['#f97677', '#ffe9ea'];
  };

  var gatherComponents = function() {
    dailyChartContainer = jQuery('#StatsTodayRoot');
    weeklyChartContainer = jQuery('#StatsWeeklyRoot');
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
    updateDay();
    updateWeek();
    updateEfficiency();
  };

  var updateDay = function() {
    var distribution = statsCalculator.buildDistribution(today.spans);
    updateChart(dailyChart, distribution);
    legendBuilder.build(dailyChartContainer, distribution);
  };

  var updateWeek = function() {
    var spans = gatherWeekSpans();
    var distribution = statsCalculator.buildDistribution(spans);

    updateChart(weeklyChart, distribution);
    legendBuilder.build(weeklyChartContainer, distribution);
  };

  var gatherWeekSpans = function() {
    var spans = [];
    for (var i = 1; i < 7; i++) {
      var currDay = timeUtil.addDays(weekStart, i);
      var day = App.persister.fetch(timeUtil.getYmd(currDay));

      jQuery.each(day.spans, function(index, span) {
        spans.push(span);
      });
    }
    return spans;
  };

  var updateChart = function(chart, distribution) {
    var labels = Object.keys(distribution);
    var values = Object.values(distribution);

    for (var i = 0; i < values.length; i++)
      values[i] = values[i].toFixed(1);

    var dataSet = chart.data.datasets[0];
    dataSet.data = values;
    dataSet.backgroundColor = App.colorGenerator.generateList(labels);
    chart.data.labels = labels;
    chart.update();
  };

  var updateEfficiency = function() {
    result = efficiencyCalculator.calc(today.spans);
    if (result == undefined) {
      efficiencyChartContainer.hide();
      return;
    }

    var totalWorked, waste, elapsed;
    [totalWorked, waste, elapsed] = result;

    var percent = (totalWorked/elapsed)*100;
    efficiencyChartContainer.find('.percent').text(percent.toFixed(0));

    efficiencyChartContainer.show();
    efficiencyChart.data.datasets[0].data = [
      totalWorked.toFixed(2), 
      waste.toFixed(2)];
    efficiencyChart.update();
  };

  init();
};
