const { src, dest, task, series, watch, parallel} = require("gulp");
const rm = require('gulp-rm');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const reload = browserSync.reload;
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');
const env = process.env.NODE_ENV;



sass.compiler = require('node-sass');
 
task('clean', () => {
  console.log(env );
 return src('dist/**/*', { read: false })
   .pipe(rm())
});
 
task('copy:html', () => {
  return src('src/*.html')
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }));
 })

 const styles = [
  'node_modules/normalize.css/normalize.css',
  'src/styles/main.scss'
 ];

 task ('styles' , () => {
  return src(styles)
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(env === 'prod', autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })))
    .pipe(gulpif(env === 'prod', gcmq()))
    .pipe(gulpif(env === 'prod', cleanCSS()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }))
});

task('scripts', () => {
  return src('src/js/*.js')
  .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.js'))
    .pipe(gulpif(env === 'prod', babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }))
 });

 task ('media' , () => {
  return src('src/media/img/pics/**')
  .pipe(dest('dist/img'))
})

 task('icons', () => {
  return src('src/media/img/icons/*.svg')
    .pipe(svgo({
      plugins: [
        {
          removeAttrs: {
            attrs: '(fill|stroke|style|width|height|data.*)'
          }
        }
      ]
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/img/icons'));
 });

 task('build',
 series(
   'clean',
   parallel('copy:html', 'styles', 'scripts', 'icons'))
);

task('server', () => {
  browserSync.init({
     server: {
         baseDir: "./dist"
     },
     open: false
 });
});

task('watch', () => {
  watch('./src/styles/**/*.scss', series('styles'));
  watch('./src/*.html', series('copy:html'));
  watch('./src/js/*.js', series('scripts'));
  watch('./src/img/icons/*.svg', series('icons'));
 });

 task('default',
 series(
   'clean',
   parallel('copy:html', 'styles', 'scripts', 'media', 'icons'),
   parallel('watch', 'server')
 )
);
 