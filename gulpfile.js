//引入gulp和gulp插件
var gulp = require('gulp'),
    assetRev = require('gulp-asset-rev'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    zip = require('gulp-zip'),
    imgSrc = 'images/*.{png,jpg,jpeg,gif,ico}',
    revCollector = require('gulp-rev-collector');

//定义css、js源文件路径
var cssOld = 'css/*.css',
    cssSrc = 'css/*.css',
    cssMinSrc = 'dist/css/*.css',
    jsSrc = 'js/*.js',
    jsMinSrc = 'dist/js/*.js',
    htmlSrc = '*.html';



//为css中引入的图片/字体等添加hash编码
gulp.task('assetRev', function(){
    return gulp.src(cssOld)   //该任务针对的文件
      .pipe(assetRev())  //该任务调用的模块
      .pipe(gulp.dest('src')); //为css中引入的图片/字体等添加hash编码后的路径
});

//压缩css
gulp.task('cssMin', function() {
    return gulp.src(cssSrc)      //压缩的文件
        .pipe(rename({suffix: ''}))    
        .pipe(minifyCss())  //执行压缩
        .pipe(gulp.dest('dist/css'));   //输出文件夹
});

//CSS生成文件hash编码并生成rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
    return gulp.src(cssMinSrc)
        .pipe(rev())  //文件名加MD5后缀
        .pipe(rev.manifest())    //必须有这个方法  生成一个rev-manifest.json
        .pipe(gulp.dest('dist/css'));   //将rev-manifest.json 保存到 dist/css 目录内
});

//压缩js
gulp.task('uglify',function(){
    return gulp.src(jsSrc)
      .pipe(rename({suffix: ''}))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

//js生成文件hash编码并生成rev-manifest.json文件名对照映射
gulp.task('revJs', function(){
    return gulp.src(jsMinSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

//压缩html
gulp.task('htmlMin',function(){
    var options = {
        collapseWhitespace:true,   //从字面意思应该可以看出来，清除空格，压缩html，这一条比较重要，作用比较大，引起的改变压缩量也特别大。
        collapseBooleanAttributes:true,   //省略布尔属性的值，比如：<input checked="checked"/>,那么设置这个属性后，就会变成 <input checked/>。
        removeComments:true,   //清除html中注释的部分，我们应该减少html页面中的注释。
        removeEmptyAttributes:true,   //清除所有的空属性。
        removeScriptTypeAttributes:true,   //清除所有script标签中的type="text/javascript"属性。
        removeStyleLinkTypeAttributes:true,   //清楚所有Link标签上的type属性。
        minifyJS:true,   //压缩html中的javascript代码。
        minifyCSS:true   //压缩html中的css代码。
    };
    return gulp.src(htmlSrc)
      .pipe(htmlmin(options))
      .pipe(gulp.dest('dist/'));
});

//Html替换css、js、img文件版本
// gulp.task('revHtml', function () {
//     return gulp.src(['dist/**/*.json', 'dist/*.html'])
//         .pipe(revCollector())
//         .pipe(gulp.dest('dist/'));
// });



//img生成文件hash编码并生成rev-manifest.json文件名对照映射
gulp.task('revImage', function(){
    return gulp.src(imgSrc)
        .pipe(rev())
        .pipe(rev.manifest())    //必须有这个方法
        .pipe(gulp.dest('dist/images'));
});

//打包
gulp.task('zip', function(){
    gulp.src('dist/**/*')
    .pipe(zip('zipName.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function (done) {
    //condition = false;
    runSequence(    //此处不能用gulp.run这个最大限度并行(异步)执行的方法，要用到runSequence这个串行方法(顺序执行)才可以在运行gulp后顺序执行这些任务并在html中加入版本号
        'assetRev',
        'cssMin',
        'revCss',
        'uglify',
        'revJs',
        'revImage',
        'htmlMin',  
        // 'revHtml',
        // 'zip',
        done);
});