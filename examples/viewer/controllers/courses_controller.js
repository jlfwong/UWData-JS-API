var CoursesController = Backbone.Controller.extend({
  routes: {
    "/courses/:faculty_acronym/:course_number": "show"
  },
  
  show: function(faculty_acronym,course_number) {
    $('body').html('Loading Course...');

    UWData.Course.where({
      faculty_acronym : faculty_acronym,
      course_number   : course_number
    }).load(function(course) {
      $('body').empty();

      var course_show_view = new CoursesShowView({
        model: course
      });

      $('body').empty().
        haml(course_show_view.render()).
        haml(["#schedule","Loading schedule..."]);

      course.classes().load(function(classes) {
        var classes_index_view = new ClassesIndexView({
          collection: classes
        });

        $('#schedule').empty().haml(classes_index_view.render());
      });
    });
  }
});
