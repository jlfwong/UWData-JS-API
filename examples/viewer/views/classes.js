var ClassesIndexView = Backbone.View.extend({
  render: function() {
    return ["%ul",
      this.collection.map(function(cur_class) {
        var view = new ClassesPartialView({
          model: cur_class
        });
        return view.render();
      })
    ];
  }
});

var ClassesPartialView = Backbone.View.extend({
  render: function() {
    var cur_class = this.model;
    return ["%li",
      ["%h3",cur_class.get('component_section')],
      ["%ul",
        ["%li",
          ["%b","Instructor:"],
          ["%span",cur_class.get('instructor_name')]
        ],
        ["%li",
          ["%b","Days:"],
          ["%span",cur_class.get('days')]
        ],
        ["%li",
          ["%b","Start Time:"],
          ["%span",cur_class.get('start_time')]
        ],
        ["%li",
          ["%b","End Time:"],
          ["%span",cur_class.get('end_time')]
        ]
      ]
    ];
  }
});
