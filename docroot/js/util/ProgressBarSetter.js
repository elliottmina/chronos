var ProgressBarSetter = function() {
  
  var set = function(container, val, max, label) {
    const percent = Math.round(val*100/max);
    const percentPx = Math.min(percent, 100);
    const color = App.colorGenerator.generate(
      App.projectSegmentor.segment(label)[0], 0.8);
    
    container.querySelector('percent-text').textContent = percent + '%';
    
    const inner = container.querySelector('inner');
    inner.style.width = percentPx + 'px';
    inner.style.backgroundColor = color;
    if (percent > percentPx)
      inner.classList.add('overage');
  };

  return {
    set:set
  };

};