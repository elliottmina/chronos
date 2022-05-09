var TableSummaryItemBuilder = function(
  timeUtil, 
  copier, 
  padder, 
  heartBuilder,
  tbody) {

  // var copyTemplate = `
  //   <li class="copy">
  //     <i class="mini_button far fa-copy copy" title="Copy tasks">
  //       <i class="fas fa-list"></i>
  //     </i>
  //   </li>`;

  var build = function(project, totalMinutes) {
    var tr = jQuery('<tr>');
    tr.appendTo(tbody);

    var td;

    td = jQuery('<td class="project">').appendTo(tr);
    td.append(App.projectSegmentor.getFormatted(project.label));


    td = jQuery('<td class="hours">').appendTo(tr);
    td.addClass('raw');
    td.text(timeUtil.formatTime(project.rawMinutes));
    
    td = jQuery('<td class="hearts">').appendTo(tr);
    td.addClass('raw');
    heartBuilder.build(project.time/60, td);

    td = jQuery('<td class="weight">').appendTo(tr);;
    td.addClass('raw');
    buildWeight(td, project.rawMinutes, totalMinutes);


    td = jQuery('<td class="hours">').appendTo(tr);;
    td.text(timeUtil.formatTime(project.time));

    td = jQuery('<td class="delta">').appendTo(tr);
    td.text(
      (project.roundDelta < 0 ? '-' : '+') + 
      timeUtil.formatTime(Math.abs(project.roundDelta)));
    
    td = jQuery('<td class="hearts">').appendTo(tr);
    heartBuilder.build(project.time/60, td);

    td = jQuery('<td class="weight">').appendTo(tr);
    buildWeight(td, project.time, totalMinutes);
  };

  var buildWeight = function(td, minutes, totalMinutes) {
    const outer = jQuery('<outer>').appendTo(td);
    const inner = jQuery('<inner>').appendTo(outer);
    const percentEl = jQuery('<percent-text>').appendTo(td);

    const percent = Math.round(minutes*100/totalMinutes);
    inner.width(percent);
    percentEl.text(percent + '%');
  };

  // var buildLabel = function(container, project) {
  //   container.find('label').append(App.projectSegmentor.getFormatted(project.label));
  // };

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