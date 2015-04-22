var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var glob = require('glob');
var fs = require('fs');

var dependencies = ['react'];

var browserifyTask = function (options) {

  // Our app bundler
  var appBundler = browserify({
    entries: [options.src],
    transform: [reactify],
    debug: options.development,
    cache: {},
    packageCache: {},
    fullPaths: options.development
  });

  appBundler.external(dependencies);

  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    var fileName = options.uglify ? 'formsy-react.min.js' : 'formsy-react.js';
    console.log('Building APP bundle');
    appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source(fileName))
      .pipe(gulpif(options.uglify, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('APP bundle built in ' + (Date.now() - start) + 'ms');

        /*
        // Fix for requirejs
        var fs = require('fs');
        var file = fs.readFileSync(options.dest + '/' + fileName).toString();
        file = file.replace('define([],e)', 'define(["react"],e)');
        fs.writeFileSync(options.dest + '/' + fileName, file);
        */
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  rebundle();

  // We create a separate bundle for our dependencies as they
  // should not rebundle on file changes. This only happens when
  // we develop. When deploying the dependencies will be included
  // in the application bundle
  if (options.development) {

    var testFiles = glob.sync('./specs/**/*-spec.js');
    var testBundler = browserify({
      entries: testFiles,
      debug: true,
      transform: [reactify],
      cache: {},
      packageCache: {},
      fullPaths: true
    });

    testBundler.external(dependencies);

    var rebundleTests = function () {
      var start = Date.now();
      console.log('Building TEST bundle');
      testBundler.bundle()
        .on('error', gutil.log)
        .pipe(source('specs.js'))
        .pipe(gulp.dest(options.dest))
        .pipe(livereload())
        .pipe(notify(function () {
          console.log('TEST bundle built in ' + (Date.now() - start) + 'ms');
        }));
    };

    testBundler = watchify(testBundler);
    testBundler.on('update', rebundleTests);
    rebundleTests();

  }

}

// Starts our development workflow
gulp.task('default', function () {

  livereload.listen({ basePath: 'specs' });
  browserifyTask({
    development: true,
    src: './src/main.js',
    dest: './build'
  });

});

gulp.task('deploy', function () {

  browserifyTask({
    development: false,
    src: './src/main.js',
    dest: './release'
  });

  browserifyTask({
    development: false,
    src: './src/main.js',
    dest: './release',
    uglify: true
  });

});
