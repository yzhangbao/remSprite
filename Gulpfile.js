var gulp = require('gulp'),  
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    minify = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    spritesmith = require('gulp.spritesmith'),
    watch = require('gulp-watch'),

    paths = {
        'html' : ['src/**/*.html'],
        'image': ['src/**/*.+(jpg|png|gif)','!src/**/icons/*.+(jpg|png|gif)'],
      	'scss' : ['src/**/*.scss'],
        'css'  : ['src/**/*.css'],
      	'lib'  : ['src/**/rui.js'],
        'js'   : ['src/**/*.js','!src/**/rui.js']
    };
gulp.task('html',function(){
    return gulp.src(paths.html)
      .pipe(gulp.dest('dist'))
});

gulp.task('scss', function() {  
  return sass('src/scss/*.scss',{sourcemap: true}) 
    .on('error', sass.logError)
    .pipe(sourcemaps.write())
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: 'source'
    }))
    .pipe(gulp.dest('src/css'));
});

gulp.task('minify',function(){
    return gulp.src(paths.css)
      .pipe(autoprefixer({
          browsers: ['last 2 versions', 'Android >= 4.0']
      }))
      .pipe(minify())
      //.pipe(rename({suffix:'.min'}))
      .pipe(gulp.dest('dist'));
});

gulp.task('imagemin',function(){
    return gulp.src(paths.image)
      .pipe(imagemin())
      .pipe(gulp.dest('dist'));
});

gulp.task('copyjs',function(){
  return gulp.src(paths.js)
    .pipe(gulp.dest('dist'));
});

gulp.task('uglify',function(){
    return gulp.src(paths.lib)
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
});

gulp.task('spritesmith', function(){
    return gulp.src('src/images/icons/*.+(jpg|png|gif)')
        .pipe(spritesmith({
            prefixName: 'icon',
            imgName: 'images/icons.png',     // 生成的图片
            cssName: 'scss/_icons.scss',    // 生成的sass文件
            //cssSpritesheetName: '', // 不解释
            padding: 10,              // 图标之间的距离
            algorithm: 'binary-tree', // 图标的排序方式
            cssTemplate: './handlebarsInheritance.scss.handlebars' // 模板
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('watch',function(){
    gulp.watch(paths.scss, ['scss']);
});

gulp.task('browsersync',function(){
	var files = [
		'src/**/*.html',
    'src/**/*.scss',
		'src/**/*.css',
		'src/**/*.+(jpg|png|gif)',
		'src/**/*.js'
	];
	browserSync.init(files,{
		server:{
			baseDir : './src'
		},
    notify: false
	});
});

gulp.task('default',['spritesmith','watch'],function(){
    gulp.start('browsersync');
    gulp.start('scss');
});

gulp.task('dist',function(){
    gulp.start('html');
    gulp.start('minify');
    gulp.start('imagemin');
    gulp.start('uglify');
    gulp.start('copyjs');
});