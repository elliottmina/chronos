var StatsColorGenerator = function() {
  
  var assignedColors = {};
  var pallete = [
    '#ffa600',
    '#ff7c43',
    '#f95d6a',
    '#d45087',
    '#a05195',
    '#665191',
    '#2f4b7c',
    '#003f5c'];
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
