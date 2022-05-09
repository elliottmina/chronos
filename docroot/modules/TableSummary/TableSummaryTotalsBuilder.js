var TableSummaryTotalsBuilder = function(heartBuilder, tbody) {
  
  var build = function(summaryData) {
    if (App.globalSettings.quarter_hour)
      buildRounded(summaryData);
    else 
      buildRaw(summaryData);
  };

  var buildRaw = function(summaryData) {
    const minutes = calcTotalRawMinutes(summaryData);

    const tr = jQuery('<tr>').appendTo(tbody);
    jQuery('<td>').appendTo(tr).text('Total'); 
    buildHours(tr, minutes);
    buildHearts(tr, minutes);
  };

  var buildRounded = function(summaryData) {
    const roundedMinutes = calcTotalRoundedMinutes(summaryData);
    const rawMinutes = calcTotalRawMinutes(summaryData);

    const tr = jQuery('<tr>').appendTo(tbody);
    jQuery('<td>').appendTo(tr).text('Total');    
    buildHours(tr, roundedMinutes);
    buildDelta(tr, roundedMinutes, rawMinutes)
    buildHearts(tr, roundedMinutes);
  };

  var buildHours = function(tr, minutes) {
    const hours = (minutes/60).toFixed(2);
    jQuery('<td class="hours">').appendTo(tr).text(hours);
  };

  var buildDelta = function(tr, roundedMinutes, rawMinutes) {
    const minutesDelta = roundedMinutes - rawMinutes;
    const hoursDelta = (minutesDelta/60).toFixed(2);
    const sign = minutesDelta < 0 ? '-' : '+'; 
    jQuery('<td class="delta">').appendTo(tr).text(sign + hoursDelta);
  };

  var buildHearts = function(tr, minutes) {
    const td = jQuery('<td class="hearts">').appendTo(tr);
    heartBuilder.build(minutes/60, td);
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
