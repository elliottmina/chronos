var TableSummaryItemBuilder = function(
  timeUtil, 
  copier, 
  heartBuilder,
  tbody) {

  var build = function(project, totalMinutes) {
    if (App.globalSettings.quarter_hour)
      buildRounded(project, totalMinutes);
    else
      buildRaw(project, totalMinutes);
  };

  var buildRaw = function(project, totalMinutes) {
    const tr = jQuery('<tr>').appendTo(tbody);
    buildProjectLabel(tr, project.label);
    buildHours(tr, project.rawMinutes);
    buildHearts(tr, project.rawMinutes); 
    buildWeight(tr, project.rawMinutes, totalMinutes, project.label);
    buildMoreToggle(tr);
  };

  var buildRounded = function(project, totalMinutes) {
    var primaryTr = jQuery('<tr>').appendTo(tbody);
    var secondaryTr = jQuery('<tr>').appendTo(tbody).toggle();
    var secondaryTd = jQuery('<td colspan="5">').appendTo(secondaryTr);

    buildProjectLabel(primaryTr, project.label);
    buildHours(primaryTr, project.time);
    buildDelta(primaryTr, project);
    buildHearts(primaryTr, project.time); 
    buildWeight(primaryTr, project.time, totalMinutes, project.label);
    buildMoreToggle(primaryTr, secondaryTr);

    buildTasks(secondaryTd, project.tasks);
  };

  var buildProjectLabel = function(tr, label) {
    const td = jQuery('<td class="project">').appendTo(tr);
    td.append(App.projectSegmentor.getFormatted(label));
  };

  var buildHours = function(tr, minutes) {
    const hours = timeUtil.formatTime(minutes);
    const td = jQuery('<td class="hours">')
      .appendTo(tr)
      .text(hours);
    jQuery('<span class="unit"> hr</span>').appendTo(td);
    jQuery('<i class="fas fa-copy copy">')
      .data('copy', hours)
      .appendTo(td)
      .click(copy)
  };

  var buildDelta = function(tr, project) {
    const sign = project.roundDelta < 0 ? '-' : '+';
    const delta = timeUtil.formatTime(Math.abs(project.roundDelta));
    jQuery('<td class="delta">').appendTo(tr).text(sign + delta);
  };

  var buildHearts = function(tr, minutes) {
    const td = jQuery('<td class="hearts">').appendTo(tr);
    heartBuilder.build(minutes/60, td);
  };

  var buildWeight = function(tr, minutes, totalMinutes, label) {
    const td = jQuery('<td class="weight">').appendTo(tr);

    const outer = jQuery('<outer>').appendTo(td);
    const inner = jQuery('<inner>').appendTo(outer);
    const percentEl = jQuery('<percent-text>').appendTo(td);

    const percent = Math.round(minutes*100/totalMinutes);
    inner.width(percent);
    percentEl.text(percent + '%');

    const projectRoot = App.projectSegmentor.segment(label)[0];
    inner.css('background-color', App.colorGenerator.generate(projectRoot, 0.8));
  };

  var buildMoreToggle = function(tr, toggleTarget) {
    const td = jQuery('<td class="more">').appendTo(tr);
    
    const toggle = jQuery('<a href="javascript:void(0);"><i class="fas fa-caret-right"></i>more</a>')
      .addClass('collapsed')
      .appendTo(td)
      .click(() => {
        toggleTarget.toggle();

        if (toggleTarget[0].style.display == 'none')
          toggle.find('i').removeClass('fa-caret-down').addClass('fa-caret-right');
        else
          toggle.find('i').removeClass('fa-caret-right').addClass('fa-caret-down');
    });
  };

  var buildTasks = function(td, tasks) {
    const container = jQuery('<div class="tasks">').appendTo(td);

    const header = jQuery('<div>').appendTo(container).text('Tasks');



    jQuery('<i class="fas fa-copy copy">')
      .data('copy', tasks.join('\n'))
      .appendTo(header)
      .click(copy)

    const listEl = jQuery('<ul>').appendTo(container);
    jQuery.each(tasks, function(index, task) {
      jQuery('<li>')
        .appendTo(listEl)
        .text(task);
    });
  };

  var copy = function() {
    var button = jQuery(this);
    var text = button.data('copy');

    button.removeClass('fa-copy').addClass('fa-check');
    setTimeout(function() {
      button.removeClass('fa-check').addClass('fa-copy');
    }, 400);

    copier.copy(text);
  };

  return {
    build:build
  };
  
};