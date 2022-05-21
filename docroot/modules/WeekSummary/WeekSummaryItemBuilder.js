var WeekSummaryItemBuilder = function(timeUtil) {

  var build = function(project, totalRawMinutes, totalRoundedMinutes, targetContainer) {
    var percent;
    var minutes;

    if (App.globalSettings.quarter_hour) {
      percent = Math.floor((project.roundedMinutes/totalRoundedMinutes)*100);
      minutes = project.roundedMinutes;
    } else {
      percent = Math.floor((project.rawMinutes/totalRawMinutes)*100);
      minutes = project.rawMinutes;
    }

    const container = document.createElement('week-item');
    targetContainer.appendChild(container);
    container.innerHTML = `
      <label></label>
      <data>
        <hours>${timeUtil.formatTime(minutes)} <unit>hr</unit></hours>
        <delta>${delta(project)}</delta>
        <outer><inner></inner></outer>
        <percent-text>${percent}%</percent-text>
      </data>
    `;

    container.querySelector('label').appendChild(label(project.label));
    buildWeight(container, project.label, percent);

    if (!App.globalSettings.quarter_hour)
      container.querySelector('delta').remove();
  };

  var label = function(label) {
    return App.projectSegmentor.getFormatted(label)[0];
  };

  var delta = function(project) {
    const sign = project.roundDelta < 0 ? '-' : '+';
    const delta = timeUtil.formatTime(Math.abs(project.roundDelta));
    return sign + delta;
  };

  var buildWeight = function(tr, label, percent) {
    label = App.projectSegmentor.segment(label)[0];
    const color = App.colorGenerator.generate(label, 0.8);
    const inner = tr.querySelector('inner');
    inner.style.width = percent + 'px';
    inner.style.backgroundColor = color;
  };

  return {
    build:build
  };

};