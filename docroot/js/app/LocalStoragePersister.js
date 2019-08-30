var LocalStoragePersister = function() {
  
  var timeUtil;
  var recordFormatter;

  var init = function() {
    timeUtil = new TimeUtil();
    recordFormatter = new LocalStorageRecordFormatter();
  };

  init();

  return {
    fetch:function(dateStr) {
      try {
        var result = localStorage.getItem(dateStr);
        var record = recordFormatter.format(result);
        return record;
      } catch (e) {
        return { date:dateStr, spans:{} };
      }
    },
    put:function(record) {
      var copy = jQuery.extend(true, {}, record);
      recordFormatter.unformat(copy);
      localStorage.setItem(record.date, JSON.stringify(copy));
    },
    clear:function() {
      localStorage.clear();
    }
  };

};
