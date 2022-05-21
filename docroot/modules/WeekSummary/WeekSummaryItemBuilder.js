var WeekSummaryItemBuilder = function(timeUtil, progressBarSetter) {

  var build = function(project, totalRawMinutes, totalRoundedMinutes, targetContainer) {
    var minutes;
    var totalMinutes;

    if (App.globalSettings.quarter_hour) {
      totalMinutes = totalRoundedMinutes;
      minutes = project.roundedMinutes;
    } else {
      minutes = project.rawMinutes;
      totalMinutes = totalRawMinutes;
    }

    const container = document.createElement('week-item');
    targetContainer.appendChild(container);
    container.innerHTML = `
      <label></label>
      <data>
        <hours>${timeUtil.formatTime(minutes)} <unit>hr</unit></hours>
        <delta>${delta(project)}</delta>
        <outer><inner></inner></outer>
        <percent-text></percent-text>
      </data>
    `;

    container.querySelector('label').appendChild(label(project.label));
    buildWeight(container, project.label, minutes, totalMinutes);

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

  var buildWeight = function(tr, label, minutes, totalMinutes) {
    progressBarSetter.set(
      tr,
      minutes,
      totalMinutes,
      label);
  };

  return {
    build:build
  };

};