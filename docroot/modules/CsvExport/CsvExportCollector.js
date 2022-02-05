CsvExportCollector = function(timeUtil) {

  var range = 500;
  var exportData;
  var currDate;

  var getStartDate = function() {
    var startYmd = timeUtil.getNewDayStr(new Date(), range*-1);
    return timeUtil.parseUtcYmd(startYmd);
  };

  var getFinishDate = function() {
    return timeUtil.addDays(new Date(), 10);
  };

  var iterate = function() {
    var record = App.persister.fetch(timeUtil.getYmd(currDate));
    Object.entries(record.spans).forEach(([k, span]) => {
      exportData.push([
        record.date, 
        span.start, 
        span.finish, 
        (span.finish - span.start)/1000/60/60,
        span.project, 
        span.tasks.join(';')]);
    });
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
