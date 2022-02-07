var ProjectSummaryItemBuilder = function(timeUtil, copier, padder, listEl) {

  var itemTemplate = `
    <li>
      <label></label>
      <content>
        <div class="hours">
          <span class="value"></span>
          <i class="far fa-copy copy"><span>Hours</span></i>
        </div>
        <div class="round_delta">
          <span class="sign"></span><span class="delta"></span>,
          originally <span class="raw"></span>
        </div>
        <div class="weight">
          <span class="value"></span> of total hours
        </div>
        <div class="tasks">
          <ul class="task_list"></ul>
        </div>
        <i class="far fa-copy copy project_copy"><span>Summary</span></i>
      </content>
    </li>
  `;

  var copyTemplate = `
    <li class="copy">
      <i class="far fa-copy copy"><span>Tasks</span></i>
    </li>`;

  var build = function(project, totalMinutes) {
    var container = jQuery(itemTemplate).appendTo(listEl);

    buildLabel(container, project);
    buildColorTreatment(container, project);
    buildTime(container, project);
    if (project.rawMinutes)
      buildRoundData(container, project);
    buildWeight(container, project, totalMinutes);
    buildTasks(container, project);
    buildProjectCopy(container, project);
  };

  var buildLabel = function(container, project) {
    container.find('label').append(App.projectSegmentor.getFormatted(project.label));
  };

  var buildTime = function(container, project) {
    var time = timeUtil.formatTime(project.time);
    container.find('.hours .value').text(time);
    container.find('.hours .copy')
      .click(copy)
      .data('copy', time);
  };

  var buildWeight = function(container, project, totalMinutes) {
    const weight = (project.time/totalMinutes)*100;
    container.find('.weight .value').text(Math.floor(weight));
  }

  var buildRoundData = function(container, project) {
    container.find('.round_delta').show();
    container.find('.raw').text(timeUtil.formatTime(project.rawMinutes));
    container.find('.sign').text(project.roundDelta ? '+' : '-');
    container.find('.delta').text(timeUtil.formatTime(Math.abs(project.roundDelta)));
  };

  var buildColorTreatment = function(container, project) {
    var projectRoot = App.projectSegmentor.segment(project.label)[0];
    container.css('background-color', App.colorGenerator.generate(projectRoot, 0.2));
    container.css('border-color', App.colorGenerator.generate(projectRoot, 0.8));
  };

  var buildProjectCopy = function(container, project) {
    var text = project.label + '\n' + 
      timeUtil.formatTime(project.time) + '\n' + 
      project.tasks.join('\n');

    container.find('.project_copy')
      .data('copy', text)
      .click(copy);
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
        .appendTo(tasksContainer);
      li.find('i')
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