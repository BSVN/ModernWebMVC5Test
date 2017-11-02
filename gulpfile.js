const gulp         = require('gulp');
const gutil        = require('gulp-util');
const del          = require('del');
const webpack      = require('webpack');
const opn          = require('opn');
const ora          = require('ora');
const path         = require('path');
const chalk        = require('chalk');
const jest         = require('gulp-jest').default;
const spawn        = require('cross-spawn');
const sass         = require('gulp-sass');
const postcss      = require('gulp-postcss');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const rename       = require('gulp-rename');
const cssnano      = require('gulp-cssnano');
const rtlcss       = require('gulp-rtlcss');


gulp.task('default', ['dev']);


/*
 * Bootstrap
 */

gulp.task('bootstrap', ['bootstrap:clean'], function () {
  return gulp.src('./sass/bootstrap.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 6
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('./src/assets/bootstrap/css'))
    .pipe(rename({ suffix: '.rtl' }))
    .pipe(rtlcss())
    .pipe(gulp.dest('./src/assets/bootstrap/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('./src/assets/bootstrap/css'));
});


gulp.task('bootstrap:clean', function () {
  return del([
    './src/assets/bootstrap/css/*'
  ]);
});


gulp.task('bootstrap:watch', ['bootstrap'], function () {
  gulp.watch('./sass/bootstrap.scss', ['bootstrap']);
});

/*
 * End of Bootstrap
 */


gulp.task('dev', ['check-version', 'bootstrap:watch'], function () {
  require('./build/dev-server');
});


gulp.task('build', ['check-version', 'bootstrap', 'clean-build'], function (callback) {
  process.env.NODE_ENV = 'production';
  const webpackConfig = require('./build/webpack.prod.conf');

  const spinner = ora('building for production...');
  spinner.start();

  webpack(webpackConfig, function (err, stats) {
    spinner.stop();
    if (err) throw err;

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      callback('Build error!');
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ));
    callback();
  });

});


gulp.task('e2e', ['check-version'], function (callback) {
  process.env.NODE_ENV = 'testing';
  const server = require('./build/dev-server');

  server.ready.then(() => {
    const opts = ['--config', 'test/e2e/nightwatch.conf.js', '--env', 'chrome'];
    const runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' });

    runner.on('exit', function (code) {
      server.close();
      callback();
      process.exit(0);
    });

    runner.on('error', function (err) {
      server.close();
      throw err;
      process.exit(1);
    });
  });
});


gulp.task('jest', ['check-version', 'tsc'], function () {
  process.env.NODE_ENV = 'test';

  return gulp.src('').pipe(jest());
});


gulp.task('tsc', function (callback) {
    const opts = ['--noEmit', '--pretty', '-p', '.'];
    const result = spawn.sync('./node_modules/.bin/tsc', opts, { stdio: 'inherit' });

    if (result.status === 0) {
      callback();
    } else {
      callback('Typescript error!');
    }
});


gulp.task('clean-build', function () {
  const config = require('./config');
  return del([
    path.join(config.build.assetsRoot, config.build.assetsSubDirectory),
    path.join(config.build.index),
  ]);
});


gulp.task('check-version', function (callback) {
  const num_errors = require('./build/check-versions')();
  if (num_errors === 0) {
    callback();
  } else {
    callback('Error in check dependencies version');
  }
});
