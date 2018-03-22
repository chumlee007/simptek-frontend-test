'use strict';
/******************************/
/********** PACKAGES **********/
/******************************/
const gulp            = require('gulp');
const pump            = require('pump'); // Error handling for Node Streams
const sass            = require('gulp-sass'); // SCSS to CSS compiler
const autoprefixer    = require('gulp-autoprefixer'); // Autoprefixes CSS for older browsers
const spawn           = require('child_process').spawn; // Spawns new process
let   node; // Variable for storing node spawned process


/********************************/
/********** GULP TASKS **********/
/********************************/
/**
 * Launch the server
 */
gulp.task('server', () => {
  if(node) { // If there is a server already running, kill it
    node.kill();
  }

  node = spawn('node', ['app.js'], {stdio: 'inherit'});

  node.on('close', code => {
    if(code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  })
});

/**
 * Restarts the server when server files and runner file is changed
 */
gulp.watch('serverWatch', () => {
  gulp.watch(['./app.js', './app/server/**/*.js'], function() {
    gulp.run('server')
  });
});

/**
 * Compiles SCSS into CSS
 */
gulp.task('compileSCSS', (done) => {
  pump([
    gulp.src('./app/client/stylesheets/main.scss'),
    sass({
      sourceComments: true,
      outputStyle: 'expanded'
    }),
    autoprefixer({
      browsers: ['last 5 versions']
    }),
    gulp.dest('./resources')
  ], done);
});

/**
 * Watcher task that has all the watchers withing it
 */
gulp.task('watch', () => {
  // Server files watcher that triggers the server task
  gulp.watch(['./app.js', './app/server/**/*.js'], function() {
    gulp.run('server')
  });

  // SCSS file watcher that triggers re-compilation of SCSS
  gulp.watch('./app/client/stylesheets/**/*', ['compileSCSS']);
})


/*************************************/
/********** GULP MAIN TASKS **********/
/*************************************/
gulp.task('default', ['compileSCSS', 'server', 'watch']);