var ProjectSummaryItemBuilder = function(
  timeUtil, 
  copier, 
  padder, 
  heartBuilder,
  listEl) {

  var itemTemplate = `
    <li>
      <label></label>
      <div class="content">
        <div class="hours">
          <span class="value"></span>
          <span class="heart-container"></span>
          <i class="mini_button far fa-copy copy" title="Copy time"></i>
        </div>
        <div class="round_delta">
          <span class="sign"></span><span class="delta"></span>,
          originally <span class="raw"></span>
        </div>
        <div class="weight">
          <progress-bar><inner-bar></inner-bar></progress-bar>
        </div>
        <div class="tasks">
          <ul class="task_list"></ul>
        </div>
      </div>
      <i class="mini_button far fa-copy copy project_copy" title="Copy everything">
        <i class="fas fa-file"></i>
      </i>
    </li>
  `;

  var copyTemplate = `
    <li class="copy">
      <i class="mini_button far fa-copy copy" title="Copy tasks">
        <i class="fas fa-list"></i>
      </i>
    </li>`;

  var build = function(project, totalMinutes) {
    var container = jQuery(itemTemplate).appendTo(listEl);

    buildLabel(container, project);
    buildTime(container, project);
    buildHearts(container, project);
    if (App.globalSettings.quarter_hour)
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
    var projectRoot = App.projectSegmentor.segment(project.label)[0];
    const weight = Math.round((project.time/totalMinutes)*100);
    const innerBar = container.find('.weight inner-bar')
    const progressBar = container.find('progress-bar');
    innerBar.css('width', weight.toString() + '%');
    innerBar.css('background-color', App.colorGenerator.generate(projectRoot, 0.8));
    progressBar.css('border-color', App.colorGenerator.generate(projectRoot, 0.8));
  }

  var buildRoundData = function(container, project) {
    if (project.roundDelta == 0) {
      container.find('.round_delta').hide();
      return;
    }
    container.find('.round_delta').show();
    container.find('.raw').text(timeUtil.formatTime(project.rawMinutes));
    container.find('.sign').text(project.roundDelta < 0 ? '-' : '+');
    container.find('.delta').text(timeUtil.formatTime(Math.abs(project.roundDelta)));
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

  var buildHearts = function(container, project) {
    const heartContainer = container.find('.heart-container');
    heartContainer.empty();

    var elapsedHours = project.time/60;
    heartBuilder.build(elapsedHours, heartContainer[0]);
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