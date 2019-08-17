var ProjectSummaryItemBuilder = function(copier, padder, regEx, listEl) {

  var itemTemplate = `
    <tr>
      <td class="project"></td>
      <td class="hours">
        <span class="value"></span>
        <span class="copy button">
          <i class="fas fa-copy"></i>
        </span>
      </td>
      <td class="tasks"><ul class="task_list"></ul></td>
    </li>
  `;

  var copyTemplate = `
    <li class="copy">
      <span class="copy button">
        <i class="fas fa-copy"></i>
      </span>
    </li>`;

  var re;

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

  var addProject = function(project) {
    var itemContainer = jQuery(itemTemplate)
      .appendTo(listEl);

    itemContainer.find('.project').html(buildLabel(project.label));
    
    var time = formatTime(project.time)
    itemContainer.find('.hours .value').text(time);
    itemContainer.find('.hours .copy')
      .click(copy)
      .data('copy', time);
    
    var tasksContainer = itemContainer.find('ul');
    jQuery.each(project.tasks, function(index, task) {
      jQuery('<li>')
        .appendTo(tasksContainer)
        .text(task);
    });

    if (project.tasks.length) {
      var li = jQuery(copyTemplate)
        .appendTo(tasksContainer)
        .click(copy)
        .data('copy', project.tasks.join('\n'));      
    }
  };

  var buildLabel = function(project) {
    if (!re)
      return segmentify(project, 1);

    var parts = project.split(re);
    if (parts.length == 1)
      return segmentify(project, 1);

    parts[0] = segmentify(parts[0], 1);
    parts[1] = segmentify(parts[1], 2);

    return parts.join('<span class="segment_separator fal fa-angle-right"></span>');
  };

  var segmentify = function(text, num) {
    return '<span class="segment segment_' + num + '">' + text + '</span>';
  };

  var formatTime = function(minutes) {
    if (App.globalSettings.use_decimal_hours)
      return formatDecimal(minutes);
    return formatMinutes(minutes);
  };

  var formatMinutes = function(minutes) {
    var hours = parseInt(minutes/60);
    var remainder = Math.ceil(minutes%60);
    remainder = padder.twoDigit(remainder);
    return hours + ':' + remainder;
  };
  
  var formatDecimal = function(minutes) {
    return round(minutes/60, 2);
  };
  
  var round = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  var copy = function() {
    var text = jQuery(this).data('copy');
    copier.copy(text);
  };

  init();
  
  return {
    build:addProject
  };
  
};