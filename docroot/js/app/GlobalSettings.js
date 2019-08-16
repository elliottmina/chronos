var GlobalSettings = function() {

  var settings = {
    use_decimal_hours: true,
    project_delimiters:':|/'
  };

  var init = function() {
    registerSettings();
  };
  
  var registerSettings = function() {
    App.settings.register([{
      section:'General',
      label:'Use decimal hours',
      value:getWithDefault('use_decimal_hours'),
      type:'boolean',
      callback:function(newValue) {
        newValue = JSON.parse(newValue);
        saveAndPublish('use_decimal_hours', newValue)
      }
    },{
      section:'General',
      label:'Project delimiter characters',
      value:getWithDefault('project_delimiters'),
      type:'text',
      callback:function(newValue) { 
        saveAndPublish('project_delimiters', newValue)
      }
    }]);
  };

  var getWithDefault = function(key) {
    var result = localStorage.getItem(key);
    return result == null ? settings[key] : result;
  };

  var saveAndPublish = function(key, newValue) {
    settings[key] = newValue;
    localStorage.setItem(key, newValue);
    App.dispatcher.publish(key.toUpperCase() + '_CHANGED');
  };

  init();

  return settings;

};
