var gulp = require('gulp'),
    uglify = require('gulp-uglify');


gulp.task('compress', function() {
    gulp.src('lib/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});