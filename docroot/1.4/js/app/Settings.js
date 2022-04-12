var Settings = function() {

  var contentContainer;
  var background;
  var fieldBuilder;
  var sections = {};
  var template = `
    <div class="background">
      <div class="content">
        <h2>Settings</h2>
        <span class="close fas fa-window-close"></span>
      </div>
    </div>
  `;
  var sectionTemplate = `
    <section class="settings_group">
      <label class="settings_group_label"></label>
    </section>`;

  var init = function() {
    build();
    gatherComponents();
    buildDependencies();
    addBehavior();
  };

  var build = function() {
    jQuery('#Settings').html(template);
  };

  var gatherComponents = function() {
    contentContainer = jQuery('#Settings .content');
    background = jQuery('#Settings .background');
  };

  var buildDependencies = function() {
    fieldBuilder = new FieldBuilder();
  };

  var addBehavior = function() {
    jQuery('#settings_button').click(show);
    jQuery('#Settings .close').click(hide);
    jQuery('#Settings .background').click(hide);
    jQuery('#Settings .content').click(function() {
      event.stopPropagation();
      event.preventDefault();
    });
  };

  var hide = function() {
    contentContainer.css('display', 'inline-block');
    background.hide();
  };

  var show = function() {
    background.show();
    contentContainer.show();
  };

  var addControl = function(index, config) {
    if (!(config.section in sections))
      createSection(config.section);

    var fieldWrapper = jQuery('<div class="field_wrapper">').appendTo(sections[config.section]);
    fieldBuilder.build(config, fieldWrapper);
  };

  var createSection = function(name) {
    sections[name] = jQuery(sectionTemplate).appendTo(contentContainer);
    sections[name].find('.settings_group_label').text(name);
  };

  init();

  return {
    register:function(controls) {
      jQuery.each(controls, addControl);
    }
  };
};
