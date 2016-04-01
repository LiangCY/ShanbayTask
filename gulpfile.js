var gulp = require("gulp");
var browserify = require('gulp-browserify');

gulp.task('browserify', function () {
  // Single entry point to browserify
  gulp.src('src/js/script.js')
    .pipe(browserify({}))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*'], ['browserify']);
});

gulp.task('default', ['watch', 'browserify']);