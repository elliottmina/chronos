var StatsPieChartBuilder = function() {
  
  return {
    build:function(el) {
      return new Chart(el,{
        type:'pie',
        options:{
          responsive:false,
          animation:{
            duration:400,
            animateRotate:false
          },
          legend:{
            display:false
          }
        },
        data:{
          datasets:[{
            data:[],
            borderWidth:0
          }]
        }
      });
    }
  };

};
