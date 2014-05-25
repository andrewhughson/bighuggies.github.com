var http       = require('http'),
    connect    = require('connect'),
    path       = require('path'),
    spawn       = require('child_process').spawn,
    gulp       = require('gulp'),
    sass       = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    prefix     = require('gulp-autoprefixer'),
    notify     = require('gulp-notify');

var handleErrors = function() {
    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};

gulp.task('styles', function() {
    return gulp.src('sass/main.scss')
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(prefix())
        .pipe(gulp.dest('css/'));
});

gulp.task('jekyll', function() {
    jekyll = spawn('jekyll.bat', ['build']);

    jekyll.stdout.on('data', function (data) {
        console.log('jekyll:\t' + data); // works fine
    });
});

gulp.task('watch', function() {
    var server = livereload();

    var reload = function(file) {
        server.changed(file.path);
    };

    gulp.watch('sass/**', ['styles']);
    gulp.watch(['css/**', '_layouts/**', '_includes/**', 'blog/**'], ['jekyll']);
    gulp.watch(['_site/**']).on('change', reload);
});

gulp.task('serve', function() {
    var app = connect()
        .use(connect.logger('dev'))
        .use(connect.static(path.resolve('_site')));

    http.createServer(app).listen(4000);
});

gulp.task('build', ['styles', 'jekyll']);
gulp.task('default', ['build', 'watch', 'serve']);