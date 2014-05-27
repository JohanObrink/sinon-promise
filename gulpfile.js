'use strict';

var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha');

gulp.task('jshint', function () {
  return gulp.src(['*.js', 'lib/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mocha', function () {
  return gulp.src(['test/**/*.js'])
    .pipe(plumber())
    .pipe(mocha({ reporter: 'Spec' }));
});

gulp.task('watch', function () {
  gulp.watch(['*.js', 'lib/**/*.js', 'test/**/*.js'], ['jshint', 'mocha']);
});

gulp.task('ci', function (cb) {
  return gulp.src(['*.js', 'lib/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('end', function () {
      return gulp.src(['test/**/*.js'])
        .pipe(plumber())
        .pipe(mocha())
        .on('end', function () { cb(); });
    });
});

gulp.task('default', ['jshint', 'mocha', 'watch']);