var HeartBuilder = function() {
  
  var buildFullHearts = function(numHearts, container) {
    for (let i = 0; i < numHearts ; i++) {
      container.append(buildBaseHeart());
    }
  };

  var buildPartialHeart = function(width, container) {
    const wrapper = document.createElement('span');
    wrapper.classList.add('heart-wrapper');

    const outer = buildBaseHeart();
    outer.classList.add('outer');

    const truncator = document.createElement('span');
    truncator.classList.add('truncator');
    truncator.style.width = width.toString() + '%';

    const inner = buildBaseHeart();
    inner.classList.add('inner');



    container.append(wrapper);
    wrapper.append(outer);
    wrapper.append(truncator);
    truncator.append(inner);

  };

  var buildBaseHeart = function() {
    const heart = document.createElement('i');
    heart.classList.add('heart');
    heart.classList.add('fas');
    heart.classList.add('fa-heart');
    return heart;
  };
  
  return {
    build:function(numHearts, container) {
      buildFullHearts(Math.floor(numHearts), container);

      const partial = numHearts % 1;
      if (partial)
        buildPartialHeart(Math.round(partial*100), container);
    }
  };

};
