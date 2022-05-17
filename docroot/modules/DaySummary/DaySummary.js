var DaySummary = function() {

  var container;
  var spans;
  var dataBuilder;
  var itemBuilder;
  var totalsBuilder;

  var init = function() {
    gatherComponents();
    buildDependencies();
    addBehavior();
  };

  var gatherComponents = function() {
    container = document.getElementById('DaySummary');
  };

  var buildDependencies = function() {
    dataBuilder = new ProjectSummaryDataBuilder();
   
    itemBuilder = new DaySummaryItemBuilder(
      new  TimeUtil(),
      new TimeFormatter12Hr(),
      new Copier(),
      new HeartBuilder(),
      container);

    totalsBuilder = new DaySummaryTotalsBuilder(
      new HeartBuilder(), 
      container);
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpansChanged);
    App.dispatcher.subscribe('SPAN_DELETED', onSpansChanged);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', updateDisplay);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', updateDisplay);
    App.dispatcher.subscribe('QUARTER_HOUR_CHANGED', updateDisplay);
    App.dispatcher.subscribe('GOAL_HOURS_DAY_CHANGED', updateDisplay);
  };

  var onDateChanged = function(date) {
    spans = date.spans;
    updateDisplay();
  };

  var onSpansChanged = function(data) {
    spans = data.record.spans;
    updateDisplay();
  };

  var updateDisplay = function() {
    var summaryData = dataBuilder.build(spans);
    applyQuarterHour(summaryData);
    populate(summaryData);
  };

  var applyQuarterHour = function(summaryData) {
    Object.entries(summaryData).forEach(projectInfo =>{
      const projNumbers = projectInfo[1];

      const rawMinutes = projNumbers.time;
      const roundedMinutes = Math.round(rawMinutes/15)*15;

      projNumbers.time = roundedMinutes;
      projNumbers.rawMinutes = rawMinutes;
      projNumbers.roundDelta = roundedMinutes - rawMinutes;
    });
  };

  var populate = function(summaryData) {
    empty();

    const totalMinutes = calcTotalMinutes(summaryData);

    var sortedKeys = Object.keys(summaryData).sort();

    sortedKeys.forEach(key => itemBuilder.build(summaryData[key], totalMinutes));

    totalsBuilder.build(summaryData);
  };

  var empty = function () {
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  };

  var calcTotalMinutes = function(summaryData) {
    return Object.entries(summaryData).reduce((total, item) => {
      return total + item[1].time;
    }, 0);
 };

  init();

};
