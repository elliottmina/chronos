var StatsLegendBuilder = function() {

  var itemTemplate = `
    <li>
      <span class="color"></span>
      <span class="text"></span>
    </li>`;

  return {
    build:function(container, distribution) {
      var list = container.find('ul.legend');
      list.empty();

      const keys = distribution.map(item => {
        return item[0];
      });

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