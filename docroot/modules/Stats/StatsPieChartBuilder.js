var StatsPieChartBuilder = function() {
  
  return {
    build:function(el) {
      return new Chart(el,{
        type:'pie',
        options:{
          title:{
            display:true,
            text:'test'
          },
          responsive:false,
          animation:{
            duration:400,
            animateRotate:false
          },
          legend:{
            display:false,
            position:'bottom'
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
