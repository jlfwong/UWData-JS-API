UWData.config({
  key: "482f9f39686298c1d5d8d5df270bc9f4"
});

var allcourses = [];
var queue = [];

function DisplayClassCount(acronym) {
  queue.push(acronym);

  UWData.Courses.where({faculty:acronym}).load(function(courses) {
    queue.shift();
    var per_year = [0,0,0,0,0,0,0,0,0];
    _.each(courses.models,function(course) {
      course.set({faculty_acronym: acronym});
      var cur_hundred_series = course.get('course_number').charAt(0) - 1;
      if (cur_hundred_series < 4) {
        allcourses.push(course);
      }
    });

    if(queue.length === 0) {
      $(document).trigger('courses_loaded');
    }
  });
}

$(document).bind('courses_loaded',function() {
  var num_to_select = 100;

  for (var i = 0; i < num_to_select; i++) {
    var cur_index = Math.floor(Math.random() * allcourses.length);
    var course = allcourses.splice(cur_index,1)[0];
    var description = course.get('description');

    description = description.replace(/\[[^\]]*Offered[^\]]*\]/,'');
    description = description.replace(/(^\s+)|(\s+$)/,'');

    if (description.length === 0) {
      i--;
      continue;
    }

    var word_count = description.split(/\s/).length;
    var new_tr = $('<tr/>').appendTo($('table#courses'));
    
    new_tr.append($('<td/>',{
      text: course.get('faculty_acronym') + ' ' + course.get('course_number')
    }));
    new_tr.append($('<td/>',{text:word_count}));
    new_tr.append($('<td/>',{text:description}));
  }

});

/*
_.each([
  'MATH',
  'MTHEL',
  'PMATH',
  'CS',
  'CM',
  'CO',
  'AMATH',
  'STAT'
],DisplayClassCount);
*/

_.each([
  'CHE',
  'CIVE',
  'ECE',
  'ENVE',
  'GENE',
  'GEOE',
  'ME',
  'MTE',
  'NE',
  'SE',
  'SYDE'
],DisplayClassCount);
