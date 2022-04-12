var SpanCreatorProjectTreatmentApplicator = function() {

  var todaysProjects = [];
  var yesterdaysProjects = [];

  return {
    todaysProjects: todaysProjects,
    yesterdaysProjects: yesterdaysProjects,
    apply: function(ul) {
      ul.find('li').each((i, item) => {
        const proj = item.querySelector('.text').innerText;
      
        if (this.todaysProjects.includes(proj))
          item.classList.add('today');


        if (this.yesterdaysProjects.includes(proj))
          item.classList.add('yesterday');

      });
    }
  };

};
