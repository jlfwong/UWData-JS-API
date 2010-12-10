var FacultiesIndexView = Backbone.View.extend({
  render: function() {
    var partial_views = [];  
    this.collection.each(function(faculty) {
      var view = new FacultiesPartialView({
        model: faculty
      });
      partial_views.push(view.render());
    });
    return ["%ul.faculties",
      partial_views
    ];
  }
});

var FacultiesPartialView = Backbone.View.extend({
  render: function() {
    var faculty = this.model;
    return ["%li.faculty",
      ["%a",{
        href: '#/faculties/' + faculty.get('acronym')
      },faculty.get('name') + ' (' + faculty.get('acronym') + ')']
    ];
  }
});

var FacultiesShowView = Backbone.View.extend({
  render: function() {
    var faculty = this.model;
    return ["%h1",
      faculty.get('name') + ' (' + faculty.get('acronym') + ')'
    ];
  }
});

