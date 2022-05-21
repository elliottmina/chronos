var DaySummaryTotalsBuilder = function(timeUtil, heartBuilder, progressBarSetter, topContainer) {
  
  var build = function(totalRawMinutes, totalRoundedMinutes) {
    if (App.globalSettings.quarter_hour)
      buildRounded(totalRawMinutes, totalRoundedMinutes);
    else 
      buildRaw(totalRawMinutes);
  };

  var buildRaw = function(totalRawMinutes) {
    const container = buildGeneric(totalRawMinutes, 0);
    if (container)
      container.querySelector('delta').remove();
  };

  var buildRounded = function(totalRawMinutes, totalRoundedMinutes) {
    buildGeneric(totalRoundedMinutes, totalRawMinutes);
  };

  var buildGeneric = function(primaryMinutes, secondaryMinutes) {
    if (!primaryMinutes) 
      return;
    
    const container = createContainer();

    container.innerHTML = `
      <header>
        <time>
          <hours>${timeUtil.formatTime(primaryMinutes)} <unit>hr</unit></hours>
          <delta>${delta(primaryMinutes, secondaryMinutes)}</delta>
          <heart-container></heart-container>
        </time>
        <weight>
          <outer><inner></inner></outer>
          <percent-text>
        </weight>
      </header>
        `;

    buildHearts(container, primaryMinutes);
    buildProgress(container, primaryMinutes);

    return container;
  };

  var createContainer = function() {
    const container = document.createElement('day-item');
    container.classList.add('totals');
    topContainer.appendChild(container);
    return container;
  };

  var delta = function(roundedMinutes, rawMinutes) {
    const minutesDelta = roundedMinutes - rawMinutes;
    const sign = minutesDelta < 0 ? '-' : '+'; 
    return sign + timeUtil.formatTime(Math.abs(minutesDelta));
  };

  var buildHearts = function(container, minutes) {
    container.querySelector('heart-container').appendChild(
      heartBuilder.build(minutes/60));
  };

  var buildProgress = function(container, minutes) {
    progressBarSetter.set(
      container,
      minutes,
      App.globalSettings.goal_hours_day * 60,
      'day-progress');
  };

  return {
    build:build
  };

};
