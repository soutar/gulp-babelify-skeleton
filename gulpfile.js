var config      = require('./config.json');

var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var glob        = require('glob');
var es          = require('event-stream');

var gulp        = require('gulp');
var options     = require('minimist')(process.argv.slice(2));
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var sourcemaps  = require('gulp-sourcemaps');
var gulpif      = require('gulp-if');

var browserify  = require('browserify');
var babel       = require('babelify').configure(config.babel_opts || {});
var uglify      = require('gulp-uglify');

var sass        = require('gulp-sass');
var minifycss   = require('gulp-minify-css');

gulp.task('dev', ['js', 'scss', 'bsync'], function () {
    gulp.watch(config.source_directory + '/' + config.js.source_glob, ['js']);
    gulp.watch(config.source_directory + '/' + config.scss.source_glob, ['scss']);
    gulp.watch('./index.html', function () {
        reload();
    });
});

gulp.task('js', function () {
    return glob(config.js.source_glob, { cwd: config.source_directory }, function(err, files) {
        var tasks = files.map(function(entry) {
            return browserify({
                    entries: [config.source_directory + '/' + entry],
                    transform: [babel],
                    debug: true
                })
                .bundle()
                .pipe(source(entry))
                .pipe(gulp.dest(config.build_directory, { base: config.source_directory }))
                .pipe(reload({ stream: true }));
            });
        return es.merge.apply(null, tasks);
    })
});

gulp.task('scss', function () {
    return gulp.src(config.source_directory + '/' + config.scss.source_glob, { base: config.source_directory })
        .pipe(gulpif(options.debug, sourcemaps.init()))
            .pipe(sass())
            .pipe(minifycss())
        .pipe(gulpif(options.debug, sourcemaps.write()))
        .pipe(gulp.dest(config.build_directory))
        .pipe(reload({ stream: true }));

});

gulp.task('bsync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});
