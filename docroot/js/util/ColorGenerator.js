var ColorGenerator = function() {
  
  var assignedColors = {};
  var pallete = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5'];
  var palleteIndex = -1;

  var getColor = function(key) {
    if (!assignedColors[key])
      assignedColor(key);
    return assignedColors[key];
  };

  var assignedColor = function(key) {
    palleteIndex++;
    if (palleteIndex >= pallete.length)
      palleteIndex = 0;

    assignedColors[key] = pallete[palleteIndex];
  };
  
  return {
    generate:function(keys) {
      var doSingle = !Array.isArray(keys);

      if (doSingle)
        keys = [keys];

      var colors = [];
      jQuery.each(keys, function(index, key) {
        colors.push(getColor(key))
      });

      if (doSingle)
        colors = colors[0];
      return colors;
    }
  };

};
