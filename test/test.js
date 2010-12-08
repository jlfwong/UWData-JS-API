UWData.config({
  key: "482f9f39686298c1d5d8d5df270bc9f4"
});

module('UWData.Faculty');

var timeout = 10000;

asyncTest('where load',function() {
  stop(timeout);
  var faculty_where = UWData.Faculty.where({faculty_acronym: 'CS'});
  equal(faculty_where.params['faculty_acronym'],'CS');

  UWData.Faculty.where({faculty_acronym: 'CS'}).load(function(faculty) {
    equal(faculty.name,'faculty');
    equal(faculty.get('acronym'),'CS');
    equal(faculty.get('name'),'Computer Science');
    start();
  });
});

asyncTest('find load ',function() {
  stop(timeout);
  var faculty_find = UWData.Faculty.find('CS');
  equal(faculty_find.params['faculty_acronym'],'CS');
  UWData.Faculty.find('CS').load(function(faculty) {
    equal(faculty.name,'faculty');
    equal(faculty.get('acronym'),'CS');
    equal(faculty.get('name'),'Computer Science');
    start();
  });
});

asyncTest('faculty no load courses',function() {
  stop(timeout);
  UWData.Faculty.find('CS').courses().load(function(courses) {
    equal(courses.name,'courses');
    ok(courses.length > 1);
    ok(courses.models[0].get('title'));
    ok(courses.models[0].get('description'));
    start();
  });
});

asyncTest('faculty load courses',function() {
  stop(timeout);
  UWData.Faculty.find('CS').load(function(faculty) {
    faculty.courses().load(function(courses) {
      equal(courses.name,'courses');
      ok(courses.length > 1);
      ok(courses.models[0].get('title'));
      ok(courses.models[0].get('description'));
      start();
    });
  });
});

module('UWData.Faculties');

asyncTest('all',function() {
  stop(timeout);
  UWData.Faculties.all().load(function(faculties) {
    ok(faculties.length > 1);  
    equal(faculties.models[0].name,'faculty');
    ok(faculties.models[0].get('acronym'));
    ok(faculties.models[0].get('name'));
    start();
  });
});

module('UWData.Course');

asyncTest('course load faculty & number', function() {
  stop(timeout);
  UWData.Course.where({
    faculty_acronym: 'ECON',
    course_number: '102'
  }).load(function(course) {
    equal(course.name,'course');
    equal(course.get('course_number'), '102');
    equal(course.get('faculty_acronym'), 'ECON');
    ok(course.get('description'));
    ok(course.get('title'));
    start();
  });
});

asyncTest('course load course id', function() {
  stop(timeout);
  UWData.Course.find(4877).load(function(course) {
    equal(course.name,'course');
    equal(course.get('course_number'), '102');
    equal(course.get('faculty_acronym'), 'ECON');
    ok(course.get('description'));
    ok(course.get('title'));
    start();
  });
});

module('UWData.Courses');

asyncTest('search',function() {
  stop(timeout);
  UWData.Courses.search('ECE 126').load(function(courses) {
    var first = courses.models[0];
    equal(first.get('faculty_acronym'),'ECE');
    equal(first.get('course_number'),'126');
    ok(first.get('description'));
    start();
  });
});
