var JsonExport = function() {

  var padder;
  var collector;
  var downloader;

  var init = function() {
    gatherDependencies();
    registerSettings();
  };

  var gatherDependencies = function() {
    padder = new Padder();
    collector = new JsonExportCollector(new TimeUtil());
    downloader = new Downloader();
  };

  var exportRecords = function() {
    var now = new Date();
    var dateStr = 
      now.getFullYear() + '-' +
      padder.twoDigit(now.getMonth()) + '-' +
      padder.twoDigit(now.getDate()) + ' ' +
      now.getHours() + ':' +
      now.getMinutes() + ':' +
      now.getSeconds();

    downloader.download(
      'Export ' + dateStr + '.json',
      'application/json', 
      JSON.stringify(collector.collect()));
  };

  var registerSettings = function() {
    App.settings.register([{
      section:'Data',
      label:'Export backup',
      type:'button',
      iconClass:'fa-download',
      callback:exportRecords
    }]);
  };

  init();

};
