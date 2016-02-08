var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var eslint = require('gulp-eslint');

var path = {
  entry_js: ["source/js/SFcrime.js"],
  //css: "source/css/*.css"
};

var destPath = {
  js: "js",
  //css: "css"
}


function compile(watch) {
  var bundler = watchify(browserify(path.entry_js, { debug: true }).transform(babel));

  function rebundle() {
    gulp.run(['lint']);
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(destPath.js));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
      console.log('-> updated!');
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('lint', function() {
  return gulp.src(path.entry_js)
            .pipe(eslint())
            .pipe(eslint.format())
});
gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
gulp.task('default',['watch']);
