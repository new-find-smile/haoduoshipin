var gulp = require('gulp');
var markdown = require('gulp-markdown');
var wrap = require('gulp-wrap');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var exec = require('gulp-exec');



gulp.task('convert', function () {
    return exec('node convert.js');
});

gulp.task('build', function () {
    return gulp.src('build/v/*.md')
        .pipe(markdown())
        .pipe(wrap({src: 'src/layout/default.html'}))
        .pipe(gulp.dest('dist/v/'));
});

gulp.task('index', function () {
    return gulp.src('build/index.md')
        .pipe(markdown())
        .pipe(wrap({src: 'src/layout/default.html'}))
        .pipe(gulp.dest('dist/'));
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('sass', function () {
    return gulp.src('src/sass/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        })) .on('error', handleError)
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('cp-assets', function () {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/'));
});

gulp.task('rebuild', ['build'], function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'cp-assets', 'index', 'build'], function() {
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(['src/*.md', 'src/layout/*.html'], ['convert','rebuild']);
    gulp.watch(['convert.js'],['convert','rebuild']);
    gulp.watch(['src/sass/*'], ['convert','sass']);
});
gulp.task('default', ['browser-sync','watch']);
