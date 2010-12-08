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
    ok(courses.at(0).get('title'));
    ok(courses.at(0).get('description'));
    start();
  });
});

asyncTest('faculty load courses',function() {
  stop(timeout);
  UWData.Faculty.find('CS').load(function(faculty) {
    faculty.courses().load(function(courses) {
      equal(courses.name,'courses');
      ok(courses.length > 1);
      ok(courses.at(0).get('title'));
      ok(courses.at(0).get('description'));
      start();
    });
  });
});

module('UWData.Faculties');

asyncTest('all load',function() {
  stop(timeout);
  UWData.Faculties.all().load(function(faculties) {
    ok(faculties.length > 1);  
    equal(faculties.at(0).name,'faculty');
    ok(faculties.at(0).get('acronym'));
    ok(faculties.at(0).get('name'));
    start();
  });
});

asyncTest('load',function() {
  stop(timeout);
  UWData.Faculties.load(function(faculties) {
    ok(faculties.length > 1);  
    equal(faculties.at(0).name,'faculty');
    ok(faculties.at(0).get('acronym'));
    ok(faculties.at(0).get('name'));
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

asyncTest('classes of unloaded course by number', function() {
  stop(timeout);
  UWData.Course.find(4877).classes().load(function(classes) {
    equal(classes.name,'classes');
    ok(classes.length > 1);
    ok(classes.at(0).get('class_number'));
    ok(classes.at(0).get('term'));
    start();
  });
});

asyncTest('classes of unloaded course by faculty', function() {
  stop(timeout);
  UWData.Course.where({
    faculty_acronym: 'ECON',
    course_number: '102'
  }).classes().load(function(classes) {
    equal(classes.name,'classes');
    ok(classes.length > 1);
    ok(classes.at(0).get('class_number'));
    ok(classes.at(0).get('term'));
    start();
  });
});

asyncTest('classes of loaded course by number', function() {
  stop(timeout);
  UWData.Course.find(4877).load(function(course) {
    course.classes().load(function(classes) {
      equal(classes.name,'classes');
      ok(classes.length > 1);
      ok(classes.at(0).get('class_number'));
      ok(classes.at(0).get('term'));
      start();
    });
  });
});

asyncTest('classes of loaded course by faculty', function() {
  stop(timeout);
  UWData.Course.where({
    faculty_acronym: 'ECON',
    course_number: '102'
  }).load(function(course) {
    course.classes().load(function(classes) {
      equal(classes.name,'classes');
      ok(classes.length > 1);
      ok(classes.at(0).get('class_number'));
      ok(classes.at(0).get('term'));
      start();
    });
  });
});

asyncTest('classes of loaded course by search', function() {
  stop(timeout);
  UWData.Courses.search('ECON 102').load(function(courses) {
    courses.at(0).classes().load(function(classes) {
      equal(classes.name,'classes');
      ok(classes.length > 1);
      ok(classes.at(0).get('class_number'));
      ok(classes.at(0).get('term'));
      start();
    });
  });
});

module('UWData.Courses');

asyncTest('search',function() {
  stop(timeout);
  UWData.Courses.search('ECE 126').load(function(courses) {
    var first = courses.at(0);
    equal(first.get('faculty_acronym'),'ECE');
    equal(first.get('course_number'),'126');
    ok(first.get('description'));
    start();
  });
});

module('UWData.Classes');

asyncTest('load by faculty & course number',function() {
  stop(timeout);
  UWData.Classes.where({
    faculty_acronym: 'ECON',
    course_number: '102'
  }).load(function(classes) {
    equal(classes.name,'classes');
    equal(classes.at(0).get('faculty_acronym'),'ECON');
    equal(classes.at(0).get('course_number'),'102');
    ok(classes.length > 1);
    start();
  });
});

asyncTest('load by course_id',function() {
  stop(timeout);
  UWData.Classes.where({
    course_id: 4877
  }).load(function(classes) {
    equal(classes.name,'classes');
    equal(classes.at(0).get('faculty_acronym'),'ECON');
    equal(classes.at(0).get('course_number'),'102');
    ok(classes.length > 1);
    start();
  });
});

module('UWData.Professor');

asyncTest('load by id',function() {
  stop(timeout);
  UWData.Professor.find(1409).load(function(prof) {
    equal(prof.name,'professor');
    equal(prof.get('first_name'),'Larry');
    equal(prof.get('last_name'),'Smith');
    start();
  });
});

module('UWData.Professors');

asyncTest('search',function() {
  stop(timeout);
  UWData.Professors.search('Larry Smith').load(function(profs) {
    equal(profs.name,'professors');
    equal(profs.at(0).get('first_name'),'Larry');
    equal(profs.at(0).get('last_name'),'Smith');
    start();
  });
});
