var ProjectSummaryItemBuilder = function(copier, padder, listEl) {

  var itemTemplate = `
    <li>
      <header>
        <span class="project"></span>
        <span class="hours">
          <span class="value"></span>
          <i class="far fa-copy copy"></i>
        </div>
      </header>
      <div class="tasks">
        <ul class="task_list"></ul>
      </div>
      <i class="far fa-copy copy project_copy"></i>
    </li>
  `;

  var copyTemplate = `
    <li class="copy">
      <i class="far fa-copy copy"></i>
    </li>`;

  var build = function(project) {
    var container = jQuery(itemTemplate).appendTo(listEl);

    buildLabel(container, project);
    buildColorTreatment(container, project);
    buildTime(container, project);
    buildTasks(container, project);
    buildProjectCopy(container, project);
  };

  var buildLabel = function(container, project) {
    var projectLabel = App.projectSegmentor.getFormatted(project.label);
    container.find('.project').html(projectLabel);
  };

  var buildTime = function(container, project) {
    var time = formatTime(project.time)
    container.find('.hours .value').text(time);
    container.find('.hours .copy')
      .click(copy)
      .data('copy', time);
  };

  var buildColorTreatment = function(container, project) {
    var projectRoot = App.projectSegmentor.segment(project.label)[0];
    var colorTrans = App.colorGenerator.generate(projectRoot, 0.3);
    var color = App.colorGenerator.generate(projectRoot);
    container.css('background-color', colorTrans);
    container.css('border-color', color);
  };

  var buildProjectCopy = function(container, project) {
    var text = project.label + '\n' + 
      formatTime(project.time) + '\n' + 
      project.tasks.join('\n');

    container.find('.project_copy')
      .data('copy', text)
      .click(copy);
  }

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

  var buildTasks = function(container, project) {
    var tasksContainer = container.find('ul');
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