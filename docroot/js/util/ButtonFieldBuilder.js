var ButtonFieldBuilder = function(config, container) {

  var template = `
    <span class="field button">
      <span class="fas"></span>
      <span class="text"></span>
    </span>`;

  return {
    build:function(config, container) {
      var field = jQuery(template).appendTo(container);
      field.find('.text').text(config.label);
      field.find('.fas').addClass(config.iconClass)
      field.click(config.callback);
    }
  };

};
