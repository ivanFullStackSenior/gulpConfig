var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    gulpRename  = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngQuant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    autoprefixer= require('gulp-autoprefixer');

gulp.task('sass', function() {
    //Можно массив ['app/sass/main.sass',...,...]
    return gulp.src('app/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});
gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jquery.js'
    ])
        .pipe(concat('jquery.gulp-min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
})
gulp.task('css-libs',['sass'], function() {
    return gulp.src('app/sass/customLibs.css')
        .pipe(cssnano())
        .pipe(gulpRename({
            suffix: '.min'
        })
        ).pipe(gulp.dest('app/css'))
})
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    })
});
gulp.task('clean', function() {
    return del.sync('dist')
});
gulp.task('clean-cache', function() {
    return cache.clearAll()
});
gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced:  true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngQuant()]
        }))
        )
        .pipe(gulp.dest('dist/img'))
})
gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});
gulp.task('build',['clean','img', 'sass', 'scripts'], function() {
    const buildCss = gulp.src('app/css/*.css')
        .pipe(gulp.dest('dist/css'));

    const buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    const buildJS = gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'));

    const buildHtml = gulp.src('app/index.html')
        .pipe(gulp.dest('dist'));
})