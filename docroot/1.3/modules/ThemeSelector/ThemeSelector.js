var ThemeSelector = function() {
  
  var body;

  var init = function() {
    gatherComponents();
    updateDisplay();
    registerSettings();
  };

  var gatherComponents = function() {
    body = jQuery(document.body);
  };

  var updateDisplay = function() {
    if (currentValue())
      body.addClass('theme_dark');
    else
      body.removeClass('theme_dark');
  };

  var onSettingChange = function(newValue) {
    localStorage.setItem('dark_theme', newValue);
    updateDisplay();
  };

  var currentValue = function() {
    return JSON.parse(localStorage.getItem('dark_theme'));
  };

  var registerSettings = function() {
    App.settings.register([{
      section:'General',
      label:'Dark theme',
      value:currentValue(),
      type:'boolean',
      callback:onSettingChange
    }]);
  };

  init();
};
