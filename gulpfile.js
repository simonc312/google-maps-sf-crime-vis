var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

var path = {
  js: "source/js/*.js",
  //css: "source/css/*.css"
};

var destPath = {
  js: "js",
  //css: "css"
}

gulp.task('es2015-to-js', function () {
  return gulp.src(path.js)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(destPath.js));
});

gulp.task('watch', function() {
  gulp.watch(path.js,['es2015-to-js']);
});

gulp.task('default',['es2015-to-js', 'watch']);