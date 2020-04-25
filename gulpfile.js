'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var del = require('del');

gulp.task('style', function() {
  return gulp.src('source/sass/u_kostra.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('clean', function() {
    return del('build');
});

gulp.task('copy', function() {
  return gulp.src([
    'source/fonts/**',
    'source/img/**'
  ], {
    base: 'source/'
  })
    .pipe(gulp.dest('./build'));
});

gulp.task('copyHtml', function() {
  return gulp.src([
    'source/index.html'
  ], {
    base: 'source/'
  })
    .pipe(gulp.dest('./build'));
});

gulp.task('serve', function() {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    ui: false
  });

  // gulp.watch('source/templates/**/*.pug', gulp.series('pug'));
  gulp.watch('source/index.html', gulp.series('copyHtml'));
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('style'));
  gulp.watch(['source/fonts/**', 'source/img/**'], gulp.series('copy'));
  gulp.watch('build/*.html').on('change', server.reload);
});

// gulp.task('build', gulp.series('clean', 'copy', 'pug', 'style'));
gulp.task('build', gulp.series('clean', 'copy', 'copyHtml', 'style'));
gulp.task('start', gulp.series('build', 'serve'));
