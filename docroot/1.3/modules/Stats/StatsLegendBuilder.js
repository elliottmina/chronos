var StatsLegendBuilder = function() {

  var itemTemplate = `
    <li>
      <span class="color"></span>
      <span class="text"></span>
    </li>`;

  var getTopKeys = function(distribution) {
    var keys = Object.keys(distribution);
    keys.sort(function(a, b) {
      return distribution[b] - distribution[a];
    });
    return keys.splice(0, 8);  
  }

  return {
    build:function(container, distribution) {
      var keys = getTopKeys(distribution);
      var list = container.find('ul.legend');
      list.empty();

      keys.forEach(function(key) {
        var li = jQuery(itemTemplate)
          .clone()
          .appendTo(list);

        li.find('.text').text(key);
        var color = App.colorGenerator.generate(key);
        li.find('.color').css('background-color', color);
      })

    }
  };

};