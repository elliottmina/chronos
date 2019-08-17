var ProjectSummary = function() {

  var html = `
    <header>Project summary</header>
    <div class="no_content_container">Nothing to see here.  Move along.</div>
    <div class="content_container">
      <input type="text" placeholder="filter" class="filter" />
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
      </table>
    </div>`;

  var dataBuilder;
  var copier;
  var itemContainer;
  var noContentContainer;
  var spans;

  var init = function() {
    dataBuilder = new ProjectSummaryDataBuilder();
    copier = new Copier();
    build();
    gatherComponents();
    addBehavior();

    itemBuilder = new ProjectSummaryItemBuilder(
      copier,
      new Padder(),
      new RegEx(),
      itemContainer);
  };

  var build = function() {
    var renderTo = jQuery('#ProjectSummary');
    renderTo.html(html);
  };

  var gatherComponents = function() {
    itemContainer = jQuery('#ProjectSummary tbody');
    noContentContainer = jQuery('#ProjectSummary .no_content_container');
    contentContainer = jQuery('#ProjectSummary .content_container');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', updateDisplay);
    jQuery('#ProjectSummary input.filter').keyup(onFilterChange);
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

  var onFilterChange = function() {
    itemContainer.find('tr').show();

    var projectText = jQuery(this).val().toLowerCase();
    if (projectText == '')
      return;
    
    var re = new RegExp(projectText.split('').join('.*'));

    itemContainer.find('tr').each(function(index, tr) {
      tr = jQuery(tr);
      var project = tr.find('.project').text().toLowerCase();
      if (!re.test(project))
        tr.hide();
    });
  };

  init();

};
