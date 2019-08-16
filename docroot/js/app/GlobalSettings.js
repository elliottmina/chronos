var GlobalSettings = function() {

  var useDecimalHours = true;

  var init = function() {
    registerSettings();
  };
  
  var registerSettings = function() {
    App.settings.register([{
      section:'General',
      label:'Use decimal hours',
      value:getWithDefault('use_decimal_hours', useDecimalHours),
      type:'boolean',
      callback:onDecimalHoursChange
    }]);
  };

  var getWithDefault = function(key, fallback) {
    var result = localStorage.getItem(key);
    return result == null ? fallback : JSON.parse(result);
  };

  var onDecimalHoursChange = function(newValue) {
    useDecimalHours = newValue;
    localStorage.setItem('use_decimal_hours', newValue);
    App.dispatcher.publish('USE_DECIMAL_HOURS_CHANGE');
  };

  init();

  return {
    useDecimalHours:useDecimalHours
  };

};
