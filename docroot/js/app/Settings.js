var Settings = function() {

  var contentContainer;
  var background;
  var fieldBuilder;
  var sections = {};
  var template = `
    <span class="mini_button settings"><i class="fas fa-cog"></i> Settings</span>
    <div class="background">
      <div class="content">
        <span class="close fas fa-window-close"></span>
      </div>
    </div>
  `;
  var sectionTemplate = `
    <section>
      <label class="section_label"></label>
      <dl></dl>
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
    jQuery('#Settings .mini_button.settings').click(show);
    jQuery('#Settings .close').click(hide);
  };

  var hide = function() {
    contentContainer.hide();
    background.hide();
  };

  var show = function() {
    background.show();
    contentContainer.show();
  };

  var addControl = function(index, config) {
    if (!(config.section in sections))
      createSection(config.section);

    var fieldWrapper = jQuery('<div>').appendTo(sections[config.section]);
    fieldBuilder.build(config, fieldWrapper);
  };

  var createSection = function(name) {
    sections[name] = jQuery(sectionTemplate).appendTo(contentContainer);
    sections[name].find('.section_label').text(name);
  };

  init();

  return {
    register:function(controls) {
      jQuery.each(controls, addControl);
    }
  };
};
