var ProjectSummaryItemBuilder = function(copier, padder, listEl) {

  var itemTemplate = `
    <li>
      <header>
        <span class="project"></span>
        <span class="hours">
          <span class="value"></span>
          <span class="copy button">
            <i class="far fa-copy"></i>
          </span>
        </div>
      </header>
      <div class="tasks">
        <ul class="task_list"></ul>
      </div>
    </li>
  `;

  var copyTemplate = `
    <li class="copy">
      <span class="copy button">
        <i class="far fa-copy"></i>
      </span>
    </li>`;

  var re;

  var addProject = function(project) {
    var itemContainer = jQuery(itemTemplate)
      .appendTo(listEl);

    itemContainer.find('.project').html(App.projectSegmentor.getFormatted(project.label));
    
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
    var button = jQuery(this);
    var icon = button.find('i');
    var text = button.data('copy');

    icon.removeClass('fa-copy').addClass('fa-check');
    setTimeout(function() {
      icon.removeClass('fa-check').addClass('fa-copy');
    }, 400);

    copier.copy(text);
  };
  
  return {
    build:addProject
  };
  
};