var ColorGenerator = function() {
  
  var assignedColors = {};
  // https://loading.io/color/random/
  var pallete = [
    ['82',  '131', '251'],
    ['40',  '227', '28'],
    ['208', '195', '29'],
    ['231', '198', '2'],
    ['165', '4',   '68'],
    ['216', '92',  '175'],
    ['143', '193', '240'],
    ['33',  '161', '121'],
    ['205', '220', '43'],
    ['139', '140', '30'],
  ];

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

  var stringify = function(rgb, a) {
    var rgba = rgb.concat(a);
    return 'rgba(' + rgba.join(',') + ')';
  };
  
  return {
    generate:function(key, alpha) {
      alpha = alpha || 1;
      return stringify(getColor(key), alpha);
    },
    generateList:function(keys, alpha) {
      alpha = alpha || 1;

      var colors = [];
      jQuery.each(keys, function(index, key) {
        colors.push(stringify(getColor(key), alpha))
      });
      return colors;
    }
  };

};
