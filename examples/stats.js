var fall2010term = 1109;

UWData.config({
  key: "482f9f39686298c1d5d8d5df270bc9f4"
});

function displayProf(info) {
  $(function() {
    var new_tr = $("<tr/>").appendTo("table#profs");
    new_tr.append($("<td/>",{text: info['course_code']}));
    new_tr.append($("<td/>",{text: info['instructor_name']}));
    new_tr.append($("<td/>",{text: info['first_name']}));
    new_tr.append($("<td/>",{text: info['last_name']}));
    new_tr.append($("<td/>",{text: info['number_of_ratings']}));
    new_tr.append($("<td/>",{text: info['overall_quality']}));
    new_tr.append($("<td/>",{text: info['ease']}));
    new_tr.append($("<td/>").append($('<a/>',{
      href: 'http://ratemyprofessors.com/ShowRatings.jsp?tid=' + info['ratemyprof_id'],
      text: 'Click'
    })));
  });
}

UWData.Courses.where({faculty: 'ECON'}).load(function(courses) {
  var professor_names = {};
  
  courses.each(function(course) {
    course.schedules({term: fall2010term}).load(function(schedules) {
      schedules.each(function(schedule) {
        if (!schedule) {
          throw new Error('wtf');
        } else {
          if ((schedule.get('component_section') || "").match(/LEC/)) {
            var instructor_name = schedule.get('instructor');
            if (instructor_name) {
              instructor_name = instructor_name.split(',');
              instructor_name = instructor_name[1].split(' ')[0] + " " + instructor_name[0];

              (function(searched_name) {
                if (!(searched_name in professor_names)) {
                  UWData.Professors.search(searched_name).load(function(profs) {
                    var found = false;
                    for (var i = 0; i < profs.length; i++) {
                      var prof = profs.models[i];
                      if (prof.get('number_of_ratings') > 0) {
                        displayProf({
                          course_code:        'ECON ' + course.get('course_number'),
                          instructor_name:    searched_name,
                          first_name:         prof.get('first_name'),
                          last_name:          prof.get('last_name'),
                          number_of_ratings:  prof.get('number_of_ratings'),
                          overall_quality:    prof.get('overall_quality'),
                          ease:               prof.get('ease'),
                          ratemyprof_id:      prof.get('ratemyprof_id')
                        });
                        found = true;
                        break;
                      }
                    }
                    if (found === false) {
                      console.log('No ratings found for ',searched_name);
                    }
                  });
                  professor_names[searched_name] = 0;  
                }
              })(instructor_name);
            }
          }
        }
      });
    });
  });
});
