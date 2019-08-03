var IntegerFieldBuilder = function() {

  var template = `
    <span class="field integer">
      <label></label>
      <input type="number" />
    </span>`;

  return {
    build:function(config, container) {
      var field = jQuery(template).appendTo(container);
      field.find('label').text(config.label);

      var input = field.find('input');
      input.val(config.value);

      input.keyup(function() {
        config.callback(input.val());
      });

      input.change(function() {
        config.callback(input.val());
      });

    }
  };

};
