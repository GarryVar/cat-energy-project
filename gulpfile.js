"use strict"

const gulp = require("gulp"),
      sourcemap = require("gulp-sourcemaps"),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      posthtml = require("gulp-posthtml"),
      concat = require("gulp-concat"),
      include = require("posthtml-include"),
      webp = require("gulp-webp"),
      imagemin = require("gulp-imagemin"),
      server = require("browser-sync").create(),
      reload = server.reload,
      plumber = require("gulp-plumber"),
      sass = require("gulp-sass"),
      csso = require("gulp-csso"),
      del = require("del"),
      rename = require("gulp-rename"),
      htmlmin = require("gulp-htmlmin"),
      babel = require("gulp-babel"),
      uglify = require("gulp-uglify-es").default;


//CSS
gulp.task("css", () => {
  return gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(csso())
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(reload({stream: true}))
});

//HTML
gulp.task("html", () => {
  return gulp.src("source/*.html")
        .pipe(htmlmin({collapseWhitespace: true }))
        .pipe(gulp.dest("build"))
});

//JS
gulp.task("js", () => {
  return gulp.src("source/js/**/*.js")
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest("build/js"))
        .pipe(reload({stream: true}))
});

//IMAGEMIN
gulp.task("images", () => {
  return gulp.src("source/img/**/*.{png, jpg, jpeg, svg}")
        .pipe(imagemin([
          imagemin.optipng({optimizationLevel: 3}),
          imagemin.jpegtran({progressive: true}),
          imagemin.svgo()
          ]))
        .pipe(gulp.dest("build/img"))
});

//WEBP
gulp.task("webp", () => {
  return gulp.src("source/img/**/*.{png,jpg}")
        .pipe(webp({quality: 50}))
        .pipe(gulp.dest("source/img/"))
});

//CLEAN
gulp.task("clean", () => {
  return del("build")
});


//copy
gulp.task("copy", () => {
return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**"
      ],
      {base: "source"}
      )
      .pipe(gulp.dest("build"))
});


//SERVER
gulp.task("server", () => {
  server.init({
    server: "build/",
    open: true,
    notify: true,
    cors: true,
    ui: false
  })

    gulp.watch("source/sass/**/*.scss", gulp.series("css","refresh"));
    gulp.watch("source/js/**/*.js", gulp.series("js","refresh"));
    gulp.watch("source/*.html", gulp.series("html","refresh"));
});

gulp.task("refresh", done => {
  server.reload();
  done();
})

gulp.task("build", gulp.series("clean","copy","css","html","js"));
gulp.task("start",gulp.series("build","server"));
