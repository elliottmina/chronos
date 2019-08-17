var SpanSummary = function() {

  var html = `
    <header>Spans</header>
    <div class="no_content_container">Nothing to see here.  Move along.</div>
    <div class="content_container">
      <input type="text" placeholder="filter" class="filter" />
      <table>
        <thead>
          <tr>
            <th class="start">Start</th>
            <th class="finish">Finish</th>
            <th class="project">Project</th>
            <th class="tasks">Tasks</th>
            <th class="elapsed">Hours</th>
            <th class="time">Time</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>`;

  var spanTemplate = `
    <tr>
      <td class="start"></td>
      <td class="finish"></td>
      <td class="project"></td>
      <td class="tasks"><ul class="task_list"></ul></td>
      <td class="elapsed"></td>
      <td class="actions">
        <span class="mini_button edit far fa-pencil"></span>
        <span class="mini_button delete far fa-trash"></span>
        <span class="mini_button repeat far fa-repeat"></span>
      </td>
    </tr>`;

  var spansContainer;
  var nonContentContainer;
  var contentContainer;
  var timeFormatter;
  var roundDecimal;
  var padder;
  var spans;
  var spanMap = {};

  var init = function() {
    getDependencies();
    build();
    addBehavior();
  };

  var getDependencies = function() {
    timeFormatter = new TimeFormatter12Hr();
    roundDecimal = Rounder.roundDecimal;
    padder = new Padder();
  };

  var build = function() {
    var renderTo = jQuery('#SpanSummary');
    renderTo.html(html);
    spansContainer = renderTo.find('tbody');
    noContentContainer = renderTo.find('.no_content_container');
    contentContainer = renderTo.find('content_container');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', populateSpans);
    jQuery('#SpanSummary input.filter').keyup(onFilterChange);
  };

  var onDateChanged = function(data) {
    spans = data.spans;
    populateSpans();
  };

  var populateSpans = function() {
    noContentContainer.show();
    spansContainer.empty();
    spanMap = {};
    jQuery.each(spans, function(index, span) {
      addSpan(span)
    });
  };

  var onSpanSaved = function(data) {
    var span = data.span;
    var container = spanMap[span.guid];
    if (container)
      populateSpan(span, container);
    else
      addSpan(span);
    spansContainer.find('.selected').removeClass('selected');
  };

  var addSpan = function(span) {
    noContentContainer.hide();
    contentContainer.show();
    var container = jQuery(spanTemplate).prependTo(spansContainer);
    spanMap[span.guid] = container;
    populateSpan(span, container);
  };

  var populateSpan = function(span, container) {
    var elapsedHours = (span.finish - span.start)/1000/60/60;
    var elapsed = formatElapsed(elapsedHours);

    container.find('.edit').data('guid', span.guid).click(editSpan);
    container.find('.delete').data('guid', span.guid).click(deleteSpan);
    container.find('.repeat').data('guid', span.guid).click(repeatSpan);

    container.find('.start').text(timeFormatter.format(span.start));
    container.find('.finish').text(timeFormatter.format(span.finish));
    container.find('.project').text(span.project);
    container.find('.elapsed').text(elapsed);

    var taskContainer = container.find('ul');
    taskContainer.empty();
    jQuery.each(span.tasks, function(index, task) {
      var li = jQuery('<li>')
        .appendTo(taskContainer)
        .text(task);
    });
  };

  var formatElapsed = function(elapsedHours) {
    if (App.globalSettings.use_decimal_hours)
      return formatDecimal(elapsedHours);
    return formatMinutes(elapsedHours);
  };

  var formatMinutes = function(elapsedHours) {
    var hours = Math.floor(elapsedHours);
    var minutes = padder.twoDigit(Math.floor((elapsedHours % 1) * 60));
    return hours + ':' + minutes;
  };

  var formatDecimal = function(elapsedHours) {
    return roundDecimal(elapsedHours, 2)
  };

  var editSpan = function() {
    var el = jQuery(this);
    var guid = el.data('guid');
    App.dispatcher.publish('EDIT_SPAN_REQUESTED', guid);
    spansContainer.find('tr').removeClass('selected');
    el.closest('tr').addClass('selected');
  };

  var deleteSpan = function() {
    var guid = jQuery(this).data('guid');
    App.dispatcher.publish('DELETE_SPAN_REQUESTED', guid);
  };

  var repeatSpan = function() {
    var guid = jQuery(this).data('guid');
    App.dispatcher.publish('REPEAT_SPAN_REQUESTED', guid);
  };

  var onSpanDeleted = function(data) {
    var guid = data.span.guid;
    spanMap[guid].remove();
    delete(spanMap[guid]);
    if (spansContainer.children().length == 0)
      noContentContainer.show();
  };

  var onFilterChange = function() {
    spansContainer.find('tr').show();

    var projectText = jQuery(this).val().toLowerCase();
    if (projectText == '')
      return;
    
    var re = new RegExp(projectText.split('').join('.*'));

    spansContainer.find('tr').each(function(index, tr) {
      tr = jQuery(tr);
      var project = tr.find('.project').text().toLowerCase();
      if (!re.test(project))
        tr.hide();
    });
  };

  init();

};
