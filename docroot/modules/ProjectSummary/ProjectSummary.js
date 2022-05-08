var ProjectSummary = function() {

  var html = `
    <header>Projects</header>
    <div class="no_content_container">Nothing to see here.  Move along.</div>
    <div class="content_container">
      <ul class="item_container"></ul>
    </div>`;

  var dataBuilder;
  var copier;
  var itemContainer;
  var noContentContainer;
  var spans;
  var itemBuilder;

  var init = function() {
    dataBuilder = new ProjectSummaryDataBuilder();
    copier = new Copier();
    build();
    gatherComponents();
    addBehavior();

    itemBuilder = new ProjectSummaryItemBuilder(
      new  TimeUtil(),
      copier,
      new Padder(),
      new HeartBuilder(),
      itemContainer);
  };

  var build = function() {
    var renderTo = jQuery('#ProjectSummary');
    renderTo.html(html);
  };

  var gatherComponents = function() {
    itemContainer = jQuery('#ProjectSummary .item_container');
    noContentContainer = jQuery('#ProjectSummary .no_content_container');
    contentContainer = jQuery('#ProjectSummary .content_container');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', updateDisplay);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', updateDisplay);
    App.dispatcher.subscribe('QUARTER_HOUR_CHANGED', updateDisplay);
  };

  var onDateChanged = function(date) {
    spans = date.spans;
    updateDisplay();
  };

  var onSpanSaved = function(data) {
    spans = data.record.spans;
    updateDisplay();
  };

  var onSpanDeleted = function(data) {
    spans = data.record.spans;
    updateDisplay();
  };

  var updateDisplay = function() {
    var summaryData = dataBuilder.build(spans);

    if (Object.keys(summaryData).length)
      populate(summaryData);
    else
      showNoContent();
  };

  var populate = function(summaryData) {
    noContentContainer.hide();

    itemContainer.empty();
    var sortedKeys = Object.keys(summaryData).sort();

    applyQuarterHour(summaryData);

    const totalMinutes = Object.entries(summaryData).reduce((total, item) => {
      return total + item[1].time;
    }, 0);

    for (var i = 0; i < sortedKeys.length; i++) {
      var key = sortedKeys[i];
      itemBuilder.build(summaryData[key], totalMinutes);
    }

    contentContainer.show();
  };

  var showNoContent = function() {
    noContentContainer.show();
    contentContainer.hide();
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

  init();

};
