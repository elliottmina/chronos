var GlobalSettings = function() {

  var settings;

  var init = function() {
    initSettings();
    registerSettings();
  };

  var initSettings = function() {
    settings = {
      use_decimal_hours: getWithDefault('use_decimal_hours', true),
      project_delimiters: getWithDefault('project_delimiters', ':|/')
    };
  };
  
  var registerSettings = function() {
    App.settings.register([{
      section:'General',
      label:'Use decimal hours',
      value:settings.use_decimal_hours,
      type:'boolean',
      callback:function(newValue) {
        saveAndPublish('use_decimal_hours', newValue)
      }
    },{
      section:'General',
      label:'Project delimiter characters',
      value:settings.project_delimiters,
      type:'text',
      callback:function(newValue) { 
        saveAndPublish('project_delimiters', newValue)
      }
    }]);
  };

  var getWithDefault = function(key, fallback) {
    var result = localStorage.getItem(key);
    return result == null ? fallback : JSON.parse(result);
  };

  var saveAndPublish = function(key, newValue) {
    settings[key] = newValue;
    localStorage.setItem(key, JSON.stringify(newValue));
    App.dispatcher.publish(key.toUpperCase() + '_CHANGED');
  };

  init();

  return settings;

};
