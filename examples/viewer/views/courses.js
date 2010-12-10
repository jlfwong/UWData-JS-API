var CoursesIndexView = Backbone.View.extend({
  render: function() {
    var partial_views = [];
    var courses = this.collection;
    this.collection.each(function(course) {
      var view = new CoursePartialView({
        model: course
      });
      partial_views.push(view.render());
    });
    return ["%ul.courses",
      partial_views 
    ];
  }
});

var CoursePartialView = Backbone.View.extend({
  render: function() {
    var course = this.model;
    var faculty_acronym = course.get('faculty_acronym') || 
      (course.collection && course.collection.get('faculty_acronym')) || 
      (course.collection && course.collection.params['faculty_acronym']) || "";
    return ["%li.course",
      faculty_acronym + " " + course.get('course_number') + " - " + course.get('title')
    ];
  }
});
