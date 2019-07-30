var Settings = function() {

  var topContainer;
  var fieldBuilder;
  var sections = {};
  var sectionTemplate = `
    <section>
      <label class="section_label"></label>
      <dl></dl>
    </section>`;

  var init = function() {
    gatherComponents();
    buildDependencies();
    addBehavior();
  };

  var gatherComponents = function() {
    topContainer = jQuery('#Settings');
  };

  var buildDependencies = function() {
    fieldBuilder = new FieldBuilder();
  };

  var addBehavior = function() {
    jQuery('#Settings').find('.mini_button.settings').click(showPanel);
  };

  var showPanel = function() {
    console.log('showing panel');
  };

  var addControl = function(index, config) {
    if (!(config.section in sections))
      createSection(config.section);

    var fieldWrapper = jQuery('<div>').appendTo(sections[config.section]);
    fieldBuilder.build(config, fieldWrapper);
  };

  var createSection = function(name) {
    sections[name] = jQuery(sectionTemplate).appendTo(topContainer);
    sections[name].find('.section_label').text(name);
  };

  init();

  return {
    register:function(controls) {
      jQuery.each(controls, addControl);
    }
  };
};
