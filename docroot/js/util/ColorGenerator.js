var ColorGenerator = function() {
  
  var assignedColors = {};
  var pallete = [
    ['71', ' 176', '103'],
    ['187', '226', '173'],
    ['97', ' 150', '188'],
    ['185', '210', '213'],
    ['237', '180', '39'],
    ['239', '211', '157'],
    ['235', '102', '113'],
    ['238', '167', '167'],
    ['158', '140', '174'],
    ['208', '202', '219'],
    ['127', '215', '193'],
    ['187', '242', '213'],
    ['55', ' 108', '114'],
    ['125', '184', '185'],
    ['238', '157', '204'],
    ['241', '201', '221'],
    ['241', '201', '221'],
    ['255', '192', '151'],
    ['159', '118', '93'],
    ['218', '193', '177']];

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
