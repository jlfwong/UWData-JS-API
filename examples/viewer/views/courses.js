var CoursesIndexView = Backbone.View.extend({
  render: function() {
    var partial_views = [];
    var courses = this.collection;
    this.collection.each(function(course) {
      var view = new CoursesPartialView({
        model: course
      });
      partial_views.push(view.render());
    });
    return ["%ul.courses",
      partial_views 
    ];
  }
});

var CoursesPartialView = Backbone.View.extend({
  render: function() {
    var course = this.model;
    var faculty_acronym = course.get('faculty_acronym') || 
      (course.collection && course.collection.get('faculty_acronym')) || 
      (course.collection && course.collection.params['faculty_acronym']) || "";
    return ["%li.course",
      ["%a",{
        href: '#/courses/' + faculty_acronym + '/' + course.get('course_number')
      },
        faculty_acronym + " " + course.get('course_number') + " - " + course.get('title')
      ]
    ];
  }
});

var CoursesShowView = Backbone.View.extend({
  render: function() {
    var course = this.model;
    var course_title = course.get('faculty_acronym') + ' ' +
      course.get('course_number') + ' - ' + 
      course.get('title');

    return [
      ["%h1",course_title],
      ["%p",course.get('description')]
    ];
  }
});
