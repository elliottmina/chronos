var SpanSummaryItemBuilder = function(
  padder, 
  roundDecimal, 
  timeFormatter,
  regEx,
  spansContainer) {

  var init = function() {
    buildMatcher();
  };
  
  var buildMatcher = function() {
    var chars = App.globalSettings.project_delimiters;
    if (chars.trim() == '')
      re = undefined;
    else
      re = regEx.delimiter(chars);
  };

  var populateSpan = function(span, container) {
    setColorTreatment(span, container);
    addBehavior(span, container);
    setText(span, container);
    buildTasks(span, container);
  };

  var setColorTreatment = function(span, container) {
    var projectRoot = App.projectSegmentor.segment(span.project)[0];
    var colorTrans = App.colorGenerator.generate(projectRoot, 0.3);
    var color = App.colorGenerator.generate(projectRoot);
    container.css('background-color', colorTrans);
    container.css('border-color', color);
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
    container.find('.project').html(buildLabel(span.project));
    container.find('.elapsed').text(elapsed);
  };

  var buildLabel = function(project) {
    if (!re)
      return segmentify(project, 1);

    var parts = project.split(re);
    if (parts.length == 1)
      return segmentify(project, 1);

    parts[0] = segmentify(parts[0], 1);
    parts[1] = segmentify(parts[1], 2);

    return parts.join(
      '<span class="segment_separator fal fa-angle-right"></span>');
  };

  var segmentify = function(text, num) {
    return '<span class="segment segment_' + num + '">' + text + '</span>';
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

  init();

  return {
    build:populateSpan
  };

};
