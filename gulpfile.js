var gulp = require('gulp');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
 
gulp.task('serve', ['index'], function() {
  connect.server();
});
 
gulp.task('default', ['webserver']);
 
gulp.task('index', function () {
  var target = gulp.src('index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['components/**/*.js', 'components/**/*.css'], {read: false});
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest('.'));
});
