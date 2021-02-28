const projFolder = "dist",
  sourceFolder = "src";

const path = {
  build: {
    html: projFolder + "/",
    css: projFolder + "/css/",
    img: projFolder + "/img/",
    fonts: projFolder + "/fonts/",
  },

  src: {
    html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
    css: sourceFolder + "/sass/style.sass",
    img: sourceFolder + "/img/**/*",
    fonts: sourceFolder + "/fonts/*.ttf",
  },
  watch: {
    html: sourceFolder + "/**/*.html",
    css: sourceFolder + "/sass/**/*.sass",
    js: sourceFolder + "/js/**/*.js",
    img: sourceFolder + "/img/**/*",
  },
  clean: "./" + projFolder + "/",
};

const {
  src,
  dest
} = require("gulp"),
  gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  groupMedia = require("gulp-group-css-media-queries"),
  cleanCss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  imagemin = require("gulp-imagemin"),
  webp = require("gulp-webp"),
  webphtml = require("gulp-webp-html"),
  webpack = require('webpack-stream');

function browSync() {
  browserSync.init({
    server: {
      baseDir: "./" + projFolder + "/",
    },
    port: 3000,
    notify: false,
  });
}

function clean() {
  return del(path.clean);
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(sass({
      outputStyle: "expanded",
    }))
    .pipe(groupMedia())
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 5 versions"],
      cascade: true,
    }))
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(rename({
      extname: ".min.css",
    }))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

function webpackForJS() {
  return gulp.src('src/js/script.js')
    .pipe(webpack({
      config: require('./webpack.config.js')
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        qualiti: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream());
}

function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts));
}

function watchFile() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], webpackForJS);
  gulp.watch([path.watch.img], images);
}

const build = gulp.series(clean, gulp.parallel(webpackForJS, css, html, images, fonts));
const watch = gulp.parallel(build, watchFile, browSync);

exports.html = html;
exports.css = css;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;