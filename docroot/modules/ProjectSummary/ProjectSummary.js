var ProjectSummary = function() {

  var html = `
    <header>Project summary</header>
    <div class="no_content_container">Nothing to see here.  Move along.</div>
    <table>
      <thead>
        <tr>
          <th class="project">Project</th>
          <th class="hours">Hours</th>
          <th class="time">Time</th>
          <th class="tasks">Tasks</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>`;

  var dataBuilder;
  var copier;
  var listEl;
  var noContentContainer;
  var spans;

  var init = function() {
    dataBuilder = new ProjectSummaryDataBuilder();
    copier = new Copier();
    build();
    addBehavior();

    itemBuilder = new ProjectSummaryItemBuilder(
      copier,
      new Padder(),
      listEl);
  };

  var build = function() {
    var renderTo = jQuery('#ProjectSummary');
    renderTo.html(html);
    listEl = renderTo.find('tbody');
    noContentContainer = renderTo.find('.no_content_container');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGE', updateDisplay);
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
    listEl.empty().show();

    var sortedKeys = Object.keys(summaryData).sort();

    for (var i = 0; i < sortedKeys.length; i++) {
      var key = sortedKeys[i];
      itemBuilder.build(summaryData[key]);
    }
  };

  var showNoContent = function() {
    noContentContainer.show();
    listEl.hide();
  };

  init();

};
