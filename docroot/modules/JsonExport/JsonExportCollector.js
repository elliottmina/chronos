JsonExportCollector = function(timeUtil) {

  var range = 500;
  var exportData;
  var currDate;

  var getStartDate = function() {
    var startYmd = timeUtil.getNewDayStr(new Date(), range*-1);
    return timeUtil.parseUtcYmd(startYmd);
  };

  var getFinishDate = function() {
    return timeUtil.addDays(new Date(), 100);
  };

  var iterate = function() {
    var record = App.persister.fetch(timeUtil.getYmd(currDate));
    if (Object.keys(record.spans).length)
      exportData.push(record);
    currDate = timeUtil.addDays(currDate, 1);
  };

  return {
    collect:function() {
      exportData = [];
      currDate = getStartDate();
      endDate = getFinishDate();

      while (currDate <= endDate)
        iterate();

      return exportData;
    }
  }
};
