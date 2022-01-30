var ProjectSummary = function() {

  var html = `
    <header>Projects</header>
    <span class="quarter-hour-toggle">
      <label>0.25</label>
      <i class="fas fa-toggle-on"></i>
    </span>
    <div class="no_content_container">Nothing to see here.  Move along.</div>
    <div class="content_container">
      <ul class="item_container"></ul>
    </div>`;

  var dataBuilder;
  var copier;
  var itemContainer;
  var noContentContainer;
  var quarterHourToggle;
  var spans;
  var useQuarterHour;

  var init = function() {
    dataBuilder = new ProjectSummaryDataBuilder();
    copier = new Copier();
    build();
    gatherComponents();
    addBehavior();
    initUseQuarterHour();
    setQuarterHourDisplay();

    itemBuilder = new ProjectSummaryItemBuilder(
      copier,
      new Padder(),
      itemContainer);
  };

  var initUseQuarterHour =  function() {
    useQuarterHour = localStorage.getItem('use_quarter_hour') == 'true' ? true : false;
  }

  var build = function() {
    var renderTo = jQuery('#ProjectSummary');
    renderTo.html(html);
  };

  var gatherComponents = function() {
    itemContainer = jQuery('#ProjectSummary .item_container');
    noContentContainer = jQuery('#ProjectSummary .no_content_container');
    contentContainer = jQuery('#ProjectSummary .content_container');
    quarterHourToggle = jQuery('#ProjectSummary .quarter-hour-toggle i');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', updateDisplay);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', updateDisplay);
    jQuery('#ProjectSummary .quarter-hour-toggle').click(onToggleQuarterHour);
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

    if (useQuarterHour)
      applyQuarterHour(summaryData);

    for (var i = 0; i < sortedKeys.length; i++) {
      var key = sortedKeys[i];
      itemBuilder.build(summaryData[key]);
    }

    contentContainer.show();
  };

  var showNoContent = function() {
    noContentContainer.show();
    contentContainer.hide();
  };

  var onToggleQuarterHour = function() {
    useQuarterHour = !useQuarterHour;
    localStorage.setItem('use_quarter_hour', useQuarterHour);
    setQuarterHourDisplay();
    updateDisplay();
  };

  var setQuarterHourDisplay = function() {
    var className = useQuarterHour ? 'fa-toggle-on' : 'fa-toggle-off';
    quarterHourToggle.removeClass('fa-toggle-on', 'fa-toggle-off').addClass(className);
  };

  var applyQuarterHour = function(summaryData) {
    Object.entries(summaryData).forEach(project =>{
      project[1].time = Math.round(project[1].time/15)*15;
    });
  };

  init();

};
