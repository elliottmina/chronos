var ButtonFieldBuilder = function(config, container) {

  var template = `
    <span class="field button">
      <span class="fas"></span>
      <label></label>
    </span>`;

  return {
    build:function(config, container) {
      var field = jQuery(template).appendTo(container);
      field.find('label').text(config.label);
      field.find('.fas').addClass(config.iconClass)
      field.click(config.callback);
    }
  };

};
