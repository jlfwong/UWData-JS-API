// Configuration
window.UWData = {
  base_url: 'http://api.uwdata.ca/v1/',
  key: null
};

/*
 * Configure UWData API
 *
 * Example Usage:
 *  UWData.config({key:'YOUR_API_KEY_HERE'});
 */
UWData.config = function(options) {
  UWData = _.extend(UWData,options);
};

/*
 * This is what interacts with uwdata.ca - a modification of Backbone.sync
 * Used by fetch, load, loadeach
 */
UWData.sync = function(method, model, success, error) {
  if (method != 'read') {
    throw new Error("UWData models are read-only");
  }

  if (UWData.key === null) {
    throw new Error("API Key was not defined: run UWData.initialize({key:'YOUR_KEY_HERE'})");
  }

  var getPath = function(object) {
    if (!(object && object.path)) {
      throw new Error("A 'path' property or function must be specified");
    }
    return _.isFunction(object.path) ? object.path() : object.path;
  };
  
  // Add any extra parameters for the query from the model
  // e.g For searching, the model will have params['q'] set
  //
  //   UWData.Professors.search('Larry Smith').loadeach(function(professor) {
  //     console.log(professor.get('first_name'), professor.get('last_name'));
  //   });
  //
  // Will add {q: 'Larry Smith'} to the data parms
  var data = _.extend({
    key: UWData.key
  }, model.params);

  // Default JSONP-request options.
  var params = {
    url:          'http://api.uwdata.ca/v1/' + getPath(model) + '.json',
    type:         'GET',
    data:         data, 
    dataType:     'jsonp',
    jsonp:        'jsonp_callback',
    success:      success,
    error:        error
  };

  //console.log("Request: " + params.url + "?key=" + UWData.key);

  // Make the request.
  $.ajax(params);
};

// All UWData Collections are derived from this
UWData.Collection = Backbone.Collection.extend({
  sync:       UWData.sync,
  params:     {},
  parse:      function(response) {
    return response[this.name];
  },
  initialize: function(models,options) {
    this.params = options;    
  },
  loadeach:    function(fcn) {
    this.bind('refresh',function() {
      this.each(fcn);
    });
    this.fetch();
    return this;
  }, 
  load:    function(fcn) {
    this.bind('refresh',function() {
      fcn(this);
    });
    this.fetch();
    return this;
  }
},{
  // Class properties
  define: function(protoProps, classProps) {
    // Class properties for all collections derived from this
    var inherited_class_props = {
      where: function(params) {
        params = params || {};
        return new this([],params);
      },
      all: function() {
        return new this;
      },
      search: function(q) {
        return this.where({q:q});
      }
    };
    var child = this.extend.call(this, protoProps, _.extend(inherited_class_props,classProps));
    return child;
  }
});

UWData.Model = Backbone.Model.extend({
  sync:       UWData.sync,
  params:     {},
  initialize: function(attributes) {
    this.attributes = attributes[this.name] || attributes;
  },
  parse:      function(attributes) {
    attributes = attributes[this.name] || attributes;
    return attributes;
  },
  load:       function(fcn) {
    this.bind('change',function() {
      fcn(this);
    });
    this.fetch();
    return this;
  }
},{
  // Class properties
  define: function(protoProps, classProps) {
    // Class properties for all models derived from this
    var inherited_class_props = {
      where: function(params) {
        var model = new this();
        model.params = params || {};
        return model;
      }
    };
    var child = this.extend.call(this, protoProps, _.extend(inherited_class_props,classProps));
    return child;
  }
});

// Faculties
UWData.Faculty = UWData.Model.define({
  name:   'faculty',
  path:   function() {
    if (this.params['faculty_acronym']) {
      return 'faculty/' + this.params['faculty_acronym'];
    } else {
      throw new Error('Must specify an acronym for faculty lookup');
    }
  },
  courses: function() {
    var acronym = this.params['faculty_acronym'] || this.get('acronym');
    return UWData.Courses.where({faculty_acronym: acronym});
  }
},{
  find:   function(acronym) {
    return this.where({faculty_acronym: acronym});
  }
});

UWData.Faculties = UWData.Collection.define({
  name:   'faculties',
  path:   'faculty/list',
  model:  UWData.Faculty
});

// Courses
UWData.Course = UWData.Model.define({
  name:   'course',
  path:   function() {
    if (this.params['faculty_acronym'] && this.params['course_number']) {
      return 'course/' + 
        this.params['faculty_acronym'] + '/' + 
        this.params['course_number'];
    } else if (this.params['course_id']) {
      return 'course/' + this.params['course_id'];
    } else {
      throw new Error('Must specify acronym and number or course id for course lookup');
    }
  },
  schedules: function(params) {
    var faculty = this.get('faculty_acronym') || 
      this.params['faculty_acronym'] || 
      this.collection.params['faculty_acronym'];

    return UWData.CourseSchedules.where(_.extend({
      faculty_acronym:  faculty,
      course_number:    this.get('course_number')
    },params || {}));
  }
},{
  find: function(cid) {
    return this.where({course_id: cid});
  }
});

UWData.Courses = UWData.Collection.define({
  name:   'courses',
  path:   function() {
    if (this.params['q']) {
      return 'course/search';
    } else if (this.params['faculty_acronym']) {
      return 'faculty/' + this.params['faculty_acronym'] + '/courses';
    } else {
      throw new Error('Must specify a faculty acronym or search query for course lookup');
    }
  },
  model:  UWData.Course
});

// Course Schedules
UWData.CourseSchedule = UWData.Model.define({
  name:   'class',
  professor: function(params) {
    var prof_id = this.get('instructor_id');
    if (prof_id === 0 || prof_id === "0") {
      throw new Error('Invalid professor ID for ' + this.get('instructor'));
    } else {
      console.log('Looking up: ' + this.get('instructor'));
    }
    return UWData.Professor.where(_.extend({
      id: prof_id
    },params ||{}));
  }
});

UWData.CourseSchedules = UWData.Collection.define({
  name:   'classes',
  path:   function() {
    if (this.params['faculty'] && this.params['course_number']) {
      return 'course/' + this.params['faculty'] + '/' + this.params['course_number'] + '/schedule';
    } else {
      throw new Error('Must specify a faculty and course number for schedule lookup');
    }
  },
  model: UWData.CourseSchedule
});

// Professors
UWData.Professor = UWData.Model.define({
  name:   'professor',
  path:   function() {
    if (this.params['id']) {
      return 'prof/' + this.params['id'];
    } else {
      throw new Error('Must specify an id for professor lookup');
    }
  }
});

UWData.Professors = UWData.Collection.define({
  name:   'professors',
  path:   function() {
    if (this.params['q']) {
      return 'prof/search';
    } else {
      throw new Error('Must specify a name for professor lookup');
    }
  },
  model: UWData.Professor
});
