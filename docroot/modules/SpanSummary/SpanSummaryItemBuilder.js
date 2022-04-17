var SpanSummaryItemBuilder = function(
  padder, 
  roundDecimal, 
  timeFormatter,
  spansContainer) {

  var init = function() {
  };
  
  var populateSpan = function(span, container) {
    addBehavior(span, container);
    setText(span, container);
    buildTasks(span, container);
  };

  var addBehavior = function(span, container) {
    container.find('.edit').data('guid', span.guid).click(editSpan);
    container.find('.delete').data('guid', span.guid).click(deleteSpan);
    container.find('.repeat').data('guid', span.guid).click(repeatSpan);
  };

  var buildTasks = function(span, container) {
    var taskContainer = container.find('.task_list');
    taskContainer.empty();
    jQuery.each(span.tasks, function(index, task) {
      var li = jQuery('<li>')
        .appendTo(taskContainer)
        .text(task);
    });
  };

  var setText = function(span, container) {
    var elapsedHours = (span.finish - span.start)/1000/60/60;
    var elapsed = formatElapsed(elapsedHours);

    container.find('.start').text(timeFormatter.format(span.start));
    container.find('.finish').text(timeFormatter.format(span.finish));
    container.find('label').html(App.projectSegmentor.getFormatted(span.project));
    container.find('.elapsed').text(elapsed);
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
    spansContainer.find('.selected').removeClass('selected');
    el.closest('li').addClass('selected');
  };

  var deleteSpan = function() {
    var guid = jQuery(this).data('guid');
    App.dispatcher.publish('DELETE_SPAN_REQUESTED', guid);
  };

  var repeatSpan = function() {
    var guid = jQuery(this).data('guid');
    App.dispatcher.publish('REPEAT_SPAN_REQUESTED', guid);
  };

  init();

  return {
    build:populateSpan
  };

};
