var DaySummaryTotalsBuilder = function(heartBuilder, tbody) {
  
  var build = function(summaryData) {
    if (App.globalSettings.quarter_hour)
      buildRounded(summaryData);
    else 
      buildRaw(summaryData);
  };

  var buildRaw = function(summaryData) {
    const minutes = calcTotalRawMinutes(summaryData);

    const tr = buildRow();
    buildProjectLabel(tr); 
    buildHours(tr, minutes);
    buildHearts(tr, minutes);
    buildProgress(tr, minutes);
  };

  var buildRounded = function(summaryData) {
    const roundedMinutes = calcTotalRoundedMinutes(summaryData);
    const rawMinutes = calcTotalRawMinutes(summaryData);

    const tr = buildRow();
    buildProjectLabel(tr);    
    buildHours(tr, roundedMinutes);
    buildDelta(tr, roundedMinutes, rawMinutes)
    buildHearts(tr, roundedMinutes);
    buildProgress(tr, roundedMinutes);
  };

  var buildRow = function() {
    return jQuery('<tr class="totals">').appendTo(tbody);
  };

  var buildProjectLabel = function(tr) {
    jQuery('<td class="label">').appendTo(tr).text('Total');    
  };

  var buildHours = function(tr, minutes) {
    const hours = (minutes/60).toFixed(2);
    jQuery('<td class="hours">').appendTo(tr).text(hours);
  };

  var buildDelta = function(tr, roundedMinutes, rawMinutes) {
    const minutesDelta = roundedMinutes - rawMinutes;
    const hoursDelta = (minutesDelta/60).toFixed(2);
    const sign = minutesDelta < 0 ? '-' : '+'; 
    jQuery('<td class="delta">').appendTo(tr).text(sign + Math.abs(hoursDelta));
  };

  var buildHearts = function(tr, minutes) {
    const td = jQuery('<td class="hearts">').appendTo(tr);
    heartBuilder.build(minutes/60, td);
  };

  var buildProgress = function(tr, minutes) {
    const td = jQuery('<td class="daily-progress">').appendTo(tr);

    const outer = jQuery('<outer>').appendTo(td);
    const inner = jQuery('<inner>').appendTo(outer);
    const percentEl = jQuery('<percent-text>').appendTo(td);

    const goalMinutes = App.globalSettings.goal_hours_day * 60;
    const percent = Math.round(minutes*100/goalMinutes);
    inner.width(percent);
    percentEl.text(percent + '%');
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
