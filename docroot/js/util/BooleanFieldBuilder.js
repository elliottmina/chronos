var BooleanFieldBuilder = function() {
  
  var template = `
    <span class="field boolean">
      <label></label>
      <span class="fas fa-toggle-on"></span>
    </span>`;

  var toggle = function(el, callback) {
    var icon = getIcon(el);
    var newValue = !currentValue(icon);
    toggleIcon(icon, newValue);
    callback(newValue);
  };

  var currentValue = function(icon) {
    return icon.hasClass('fa-toggle-on')
  };

  var toggleIcon = function(icon, value) {
    if (value)
      icon.removeClass('fa-toggle-off').addClass('fa-toggle-on');
    else
      icon.removeClass('fa-toggle-on').addClass('fa-toggle-off');
  };

  var getIcon = function(el) {
    return jQuery(el).find('.fas');
  };

  return {
    build:function(config, container) {
      var field = jQuery(template).appendTo(container);
      field.find('label').text(config.label);

      field.click(function() {
        toggle(this, config.callback);
      });

      if (!config.value)
        toggleIcon(getIcon(field[0]));
    }
  };
};