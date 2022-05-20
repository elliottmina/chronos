var DaySummaryTotalsBuilder = function(timeUtil, heartBuilder, topContainer) {
  
  var build = function(summaryData) {
    if (App.globalSettings.quarter_hour)
      buildRounded(summaryData);
    else 
      buildRaw(summaryData);
  };

  var buildRaw = function(summaryData) {
    const container = buildGeneric(calcTotalRawMinutes(summaryData), 0);
    if (container)
      container.querySelector('delta').remove();
  };

  var buildRounded = function(summaryData) {
    buildGeneric(
      calcTotalRoundedMinutes(summaryData), 
      calcTotalRawMinutes(summaryData));
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
    const goalMinutes = App.globalSettings.goal_hours_day * 60;
    const percent = Math.round(minutes*100/goalMinutes);

    const inner = container.querySelector('inner');
    inner.style.width = percent + 'px';

    container.querySelector('percent-text').textContent = percent + '%';
  };

  var calcTotalRawMinutes = function(summaryData) {
    return Object.entries(summaryData).reduce((total, projectInfo) =>{
      return total + projectInfo[1].rawMinutes;
    }, 0);
  };

  var calcTotalRoundedMinutes = function(summaryData) {
    return Object.entries(summaryData).reduce((total, projectInfo) =>{
      return total + Math.round(projectInfo[1].time/15)*15;
    }, 0);
  };

  return {
    build:build
  };

};
