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
    updateDisplay(
      dailyChart,
      dailyChartContainer,
      today.spans);
  };

  var updateWeek = function() {
    updateDisplay(
      weeklyChart,
      weeklyChartContainer,
      gatherWeekSpans());
  };

  var updateDisplay = function(chart, chartContainer, spans) {
    var distribution = statsCalculator.buildDistribution(spans);
    condenseDistribution(distribution);
    updateChart(chart, distribution);
    legendBuilder.build(chartContainer, distribution);
  };

  var condenseDistribution = function(distribution) {
    if (distribution.length <= 4)
      return distribution;

    const excessTime = extractExcessTime(distribution);
    distribution.push(['Misc', excessTime]);

    return distribution;
  };

  var extractExcessTime = function(distribution) {
    const excess = distribution.splice(3);
    return excess.reduce((total, item) => {
      return total + item[1];
    }, 0);
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

  var updateChart = function(chart, distribution) {
    distribution.forEach(item => {
      item[1] = item[1].toFixed(1);
    });

    var labels = distribution.map(item => {
        return item[0];
    });
    const values = distribution.map(item => {
      return item[1];
    });

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

    efficiencyChartContainer.show();
    efficiencyChart.data.datasets[0].data = [
      totalWorked.toFixed(2), 
      waste.toFixed(2)];
    efficiencyChart.update();
  };

  init();
};
