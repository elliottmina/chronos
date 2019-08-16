var ModalDialogue = function(config) {

  var dialogueTemplate = `
    <div class="ModalDialogue">
      <div class="box">
        <header></header>
        <div class="contents"></div>
        <div class="button_container">
        </div>
      </div>
    </div>`;

  var buttonTemplate = `
    <span class="button"></span>`;

  var topContainer;

  var build = function() {
    jQuery(document.body).css('overflow', 'hidden');

    topContainer = jQuery(dialogueTemplate).appendTo(document.body);
    var buttonContainer = topContainer.find('.button_container');
    var header = topContainer.find('header');

    header.text(config.message);

    if (config.contents)
      topContainer
        .find('.contents')
        .append(config.contents);

    jQuery.each(config.buttons, function(index, button) {
      jQuery(buttonTemplate)
        .appendTo(buttonContainer)
        .text(button.label)
        .addClass(button.role)
        .click(function() {
          if (button.autoClose)
            close();
          if (button.callback)
            button.callback();
        });
    });
  };

  var close = function() {
    jQuery(document.body).css('overflow', 'auto');
    topContainer.remove();
  };

  build();

  return {
    close:close
  };

};
