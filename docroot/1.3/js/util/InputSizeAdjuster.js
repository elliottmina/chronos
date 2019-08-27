var InputSizeAdjuster = function(input, conf) {
  
  var defaultConfig = {
    threshold:20,
    baseSize: 1.35,
    adjustmentCoefficient:0.05,
    minSize:0.8
  };

  var init = function() {
    applyDefaults();
    input.keyup(onKeyUp);
    input.width(input.width());
    input.height(input.height());
  };

  var applyDefaults = function() {
    if (!conf)
      conf = {};
    jQuery.each(defaultConfig, function(k, v) {
      if (!conf[k])
        conf[k] = defaultConfig[k];
    });
  };

  var onKeyUp = function() {
    var len = input.val().length;
    var overage = len - conf.threshold;
    if (overage <= 0) {
      input.css('font-size', conf.baseSize + 'em');
      return;
    }

    var adjustment = overage*conf.adjustmentCoefficient;
    var size = conf.baseSize - adjustment;
    size = Math.max(size, conf.minSize);

    input.css('font-size', size + 'em');
  };

  init();
};
