var TableSummaryItemBuilder = function(
  timeUtil, 
  copier, 
  padder, 
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
  };

  var buildRounded = function(project, totalMinutes) {
    const tr = jQuery('<tr>').appendTo(tbody);
    buildProjectLabel(tr, project.label);
    buildHours(tr, project.time);
    buildDelta(tr, project);
    buildHearts(tr, project.time); 
    buildWeight(tr, project.time, totalMinutes, project.label);
  };

  var buildProjectLabel = function(tr, label) {
    const td = jQuery('<td class="project">').appendTo(tr);
    td.append(App.projectSegmentor.getFormatted(label));
  };

  var buildHours = function(tr, minutes) {
    jQuery('<td class="hours">')
      .appendTo(tr)
      .text(timeUtil.formatTime(minutes));
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

  // var copyTemplate = `
  //   <li class="copy">
  //     <i class="mini_button far fa-copy copy" title="Copy tasks">
  //       <i class="fas fa-list"></i>
  //     </i>
  //   </li>`;

  // var buildTime = function(container, project) {
  //   var time = timeUtil.formatTime(project.time);
  //   container.find('.hours .value').text(time);
  //   container.find('.hours .copy')
  //     .click(copy)
  //     .data('copy', time);
  // };

  // var buildWeight = function(container, project, totalMinutes) {
  //   var projectRoot = App.projectSegmentor.segment(project.label)[0];
  //   const weight = Math.round((project.time/totalMinutes)*100);
  //   const innerBar = container.find('.weight inner-bar')
  //   const progressBar = container.find('progress-bar');
  //   innerBar.css('width', weight.toString() + '%');
  //   innerBar.css('background-color', App.colorGenerator.generate(projectRoot, 0.8));
  //   progressBar.css('border-color', App.colorGenerator.generate(projectRoot, 0.8));
  // }

  // var buildProjectCopy = function(container, project) {
  //   var text = project.label + '\n' + 
  //     timeUtil.formatTime(project.time) + '\n' + 
  //     project.tasks.join('\n');

  //   container.find('.project_copy')
  //     .data('copy', text)
  //     .click(copy);
  // };

  // var buildTasks = function(container, project) {
  //   var tasksContainer = container.find('ul');
  //   jQuery.each(project.tasks, function(index, task) {
  //     jQuery('<li>')
  //       .appendTo(tasksContainer)
  //       .text(task);
  //   });

  //   if (project.tasks.length) {
  //     var li = jQuery(copyTemplate)
  //       .appendTo(tasksContainer);
  //     li.find('i')
  //       .click(copy)
  //       .data('copy', project.tasks.join('\n'));      
  //   }
  // };

  // var copy = function() {
  //   var button = jQuery(this);
  //   var text = button.data('copy');

  //   button.removeClass('fa-copy').addClass('fa-check');
  //   setTimeout(function() {
  //     button.removeClass('fa-check').addClass('fa-copy');
  //   }, 400);

  //   copier.copy(text);
  // };

  return {
    build:build
  };
  
};