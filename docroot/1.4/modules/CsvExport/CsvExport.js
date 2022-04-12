var CsvExport = function() {

  var padder;
  var collector;
  var downloader;

  var init = function() {
    gatherDependencies();
    registerSettings();
  };

  var gatherDependencies = function() {
    padder = new Padder();
    collector = new CsvExportCollector(new TimeUtil());
    downloader = new Downloader();
  };

  var exportRecords = function() {
    var now = new Date();
    var dateStr = 
      now.getFullYear() + '-' +
      padder.twoDigit(now.getMonth()+1) + '-' +
      padder.twoDigit(now.getDate()) + ' ' +
      now.getHours() + ':' +
      now.getMinutes() + ':' +
      now.getSeconds();

    let str = 'Date,Start,Finish,Duration,Project,Tasks\n';
    const data = collector.collect();
    data.forEach(row => {
      row.forEach((cell, i) => {
        row[i] = '"' + cell.toString().replace(/"/g, '""') + '"';
      });
      str += row.join(',') + '\n';
    });

    downloader.download(
      'Export ' + dateStr + '.csv',
      'text/csv', 
      str);
  };

  var registerSettings = function() {
    App.settings.register([{
      section:'Data',
      label:'Download CSV',
      type:'button',
      iconClass:'fa-download',
      callback:exportRecords
    }]);
  };

  init();

};
