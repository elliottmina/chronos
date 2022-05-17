var DaySummaryTotalsBuilder = function(heartBuilder, topContainer) {
  
  var build = function(summaryData) {
    if (App.globalSettings.quarter_hour)
      buildRounded(summaryData);
    else 
      buildRaw(summaryData);
  };

  var buildRaw = function(summaryData) {
    // const minutes = calcTotalRawMinutes(summaryData);

    // const tr = buildRow();
    // buildProjectLabel(tr); 
    // buildHours(tr, minutes);
    // buildHearts(tr, minutes);
    // buildProgress(tr, minutes);
  };

  var buildRounded = function(summaryData) {
    const roundedMinutes = calcTotalRoundedMinutes(summaryData);
    const rawMinutes = calcTotalRawMinutes(summaryData);

    const container = document.createElement('day-item');
    container.classList.add('totals');
    topContainer.appendChild(container);

    container.innerHTML = `
      <header>
        <time>
          <hours>${hours(roundedMinutes)} <unit>hr</unit></hours>
          <delta>${delta(roundedMinutes, rawMinutes)}</delta>
          <heart-container></heart-container>
        </time>
        <weight>
          <outer><inner></inner></outer>
          <percent-text>
        </weight>
      </header>
        `;

    container.querySelector('heart-container').appendChild(
      heartBuilder.build(roundedMinutes/60));

    buildProgress(container, roundedMinutes);
  };

  var hours = function(minutes) {
    return (minutes/60).toFixed(2);
  };

  var delta = function(roundedMinutes, rawMinutes) {
    const minutesDelta = roundedMinutes - rawMinutes;
    const hoursDelta = (minutesDelta/60).toFixed(2);
    const sign = minutesDelta < 0 ? '-' : '+'; 
    return sign + Math.abs(hoursDelta);
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
