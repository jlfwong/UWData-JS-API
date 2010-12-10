var FacultiesController = Backbone.Controller.extend({
  routes: {
    "/faculties/":                          "index",
    "/faculties/:faculty_acronym":  "show"
  },

  index: function() {
    $('body').html('Loading faculty list...');
    UWData.Faculties.load(function(faculties) {
      var view = new FacultiesIndexView({
        collection: faculties
      });
      $('body').empty().haml(view.render());
    });
  },

  show: function(faculty_acronym) {
    $('body').html('Loading faculty...');
    UWData.Faculty.where({
      faculty_acronym: faculty_acronym
    }).load(function(faculty) {
      var faculty_show_view = new FacultiesShowView({
        model: faculty
      });

      $('body').empty().
        haml(faculty_show_view.render()).
        haml(['#courses','Loading courses...']);

      faculty.courses().load(function(courses) {
        var courses_index_view = new CoursesIndexView({
          collection: courses
        });
        $('#courses').empty().
          haml(courses_index_view.render());
      });
    });
  }
});
