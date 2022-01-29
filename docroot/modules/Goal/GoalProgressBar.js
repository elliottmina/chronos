var GoalProgressBar = function(elId) {

  var topContainer;
  var innerBar;

  var init = function() {
    topContainer = jQuery('#' + elId);
    innerBar = topContainer.find('inner-bar');
  };

  init();

  return {
    update:function(percent) {
      innerBar[0].style.width = percent + '%';
    }
  }

};
