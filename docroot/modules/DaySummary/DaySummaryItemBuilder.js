var DaySummaryItemBuilder = function(
  timeUtil, 
  timeFormatter,
  copier, 
  heartBuilder,
  topContainer) {

  var build = function(project, totalMinutes) {
    if (App.globalSettings.quarter_hour)
      buildRounded(project, totalMinutes);
    else
      buildRaw(project, totalMinutes);
  };

  var buildRounded = function(project, totalMinutes) {
    buildGeneric(project.time, project, totalMinutes)
  };

  var buildRaw = function(project, totalMinutes) {
    const container = buildGeneric(project.rawMinutes, project, totalMinutes);
    container.querySelector('delta').remove();
  };

  var buildGeneric = function(time, project, totalMinutes) {
    const container = document.createElement('day-item');
    topContainer.append(container);

    container.innerHTML = `
      <header>
        <label></label>
        <weight>
          <outer><inner></inner></outer>
          <percent-text>
        </weight>
      </header>
      <time>
        <hours>${timeUtil.formatTime(time)}</hours>
        <unit>hr</unit>
        <i class="far fa-copy copy"></i>
        
        <delta>${delta(project)}</delta>
        <heart-container></heart-container>
      </time>
      <tasks-container>
        <ul></ul>
        <i class="far fa-copy copy"></i>
      </tasks-container>
    `;

    container.querySelector('label').appendChild(label(project.label));

    container.querySelector('heart-container').appendChild(
      heartBuilder.build(project.time/60));

    buildWeight(
      container,
      time, 
      totalMinutes, 
      project.label);

    buildTasks(container.querySelector('ul'), project.tasks);

    addBehavior(container, project);

    return container;
  };

  var label = function(label) {
    return App.projectSegmentor.getFormatted(label)[0];
  };

  var delta = function(project) {
    const sign = project.roundDelta < 0 ? '-' : '+';
    const delta = timeUtil.formatTime(Math.abs(project.roundDelta));
    return sign + delta;
  };

  var buildWeight = function(container, minutes, totalMinutes, label) {
    const percent = Math.round(minutes*100/totalMinutes);
    const projectRoot = App.projectSegmentor.segment(label)[0];
    const color = App.colorGenerator.generate(projectRoot, 0.8);
    
    container.querySelector('percent-text').textContent = percent + '%';
    
    const inner = container.querySelector('inner');
    inner.style.width = percent + 'px';
    inner.style.backgroundColor = color;
  };

  var buildTasks = function(list, tasks) {
    tasks.forEach(task => {
      const item = document.createElement('li')
      item.textContent = task;
      list.appendChild(item);
    });
  };

  var addBehavior = function(container, project) {
    const hourCopy = container.querySelector('time');
    hourCopy.setAttribute('copy', timeUtil.formatTime(project.time));
    hourCopy.addEventListener('click', copy);

    const taskCopy = container.querySelector('tasks-container');
    taskCopy.setAttribute('copy', project.tasks.join('\n'));
    taskCopy.addEventListener('click', copy);
  };

  var copy = function() {
    const val = this.getAttribute('copy');

    const indicator = this.querySelector('i');

    indicator.classList.remove('fa-copy');
    indicator.classList.add('fa-check');

    setTimeout(() => {
      indicator.classList.remove('fa-check');
      indicator.classList.add('fa-copy');
    }, 400);

    copier.copy(val);
  };

  return {
    build:build
  };
  
};