UWData.config({
  key: "482f9f39686298c1d5d8d5df270bc9f4",
  term: 1109 // FIXME: Remove hardcode for this
});


$(function() {
  new FacultiesController;
  new CoursesController;
  Backbone.history.start();
});
