var FacultiesController = Backbone.Controller.extend({
  routes: {
    "/faculties/":                          "index",
    "/faculties/:faculty_acronym/courses":  "courses"
  },

  index: function() {
    $('body').html('');
    UWData.Faculties.load(function(faculties) {
      var view = new FacultiesIndexView({
        collection: faculties
      });
      $('body').haml(view.render());
    });
  },

  courses: function(faculty_acronym) {
    $('body').html('');
    UWData.Faculty.where({
      faculty_acronym: faculty_acronym
    }).load(function(faculty) {
      var faculty_show_view = new FacultiesShowView({
        model: faculty
      });
      $('body').haml(faculty_show_view.render());

      faculty.courses().load(function(courses) {
        var courses_index_view = new CoursesIndexView({
          collection: courses
        });
        $('body').haml(courses_index_view.render());
      });
    });
  }
});
