var StatsColorGenerator = function() {
  
  var assignedColors = {};
  var pallete = ['red', 'blue', 'green'];
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
      var colors = [];
      jQuery.each(keys, function(index, key) {
        colors.push(getColor(key))
      });
      return colors;
    }
  };

};
