var GlobalSettings = function() {

  var settings;

  var init = function() {
    initSettings();
    registerSettings();
  };

  var initSettings = function() {
    settings = {
      use_decimal_hours: getWithDefault('use_decimal_hours', true),
      project_delimiters: getWithDefault('project_delimiters', ':|/'),
      quarter_hour: getWithDefault('quarter_hour', false),
      goal_hours_day: getWithDefault('goal_hours_day', 8),
      goal_hours_week: getWithDefault('goal_hours_week', 40),
    };
  };
  
  var registerSettings = function() {
    App.settings.register([{
      section:'General',
      label:'Project delimiter characters',
      value:settings.project_delimiters,
      type:'text',
      callback: val => saveAndPublish('project_delimiters', val)
    },{
      section:'Hours',
      label:'Use decimal hours',
      value:settings.use_decimal_hours,
      type:'boolean',
      callback: val => saveAndPublish('use_decimal_hours', val)
    },{
      section:'Hours',
      label:'Round to quarter hour',
      value: settings.quarter_hour,
      type:'boolean',
      callback:val => saveAndPublish('quarter_hour', val)
    },{
      section:'Goal',
      label:'Hours per day',
      value:settings.goal_hours_day,
      type:'integer',
      callback:val => saveAndPublish('goal_hours_day', val)
    },{
      section:'Goal',
      label:'Hours per week',
      value:settings.goal_hours_week,
      type:'integer',
      callback:val => saveAndPublish('goal_hours_week', val)
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
