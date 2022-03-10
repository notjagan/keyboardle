import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import { stream as wiredep } from 'wiredep';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import es from 'event-stream';

const $ = gulpLoadPlugins();

gulp.task('extras', () => gulp.src([
  'app/*.*',
  'app/_locales/**',
  '!app/scripts.babel',
  '!app/*.json',
  '!app/*.html',
], {
  base: 'app',
  dot: true,
}).pipe(gulp.dest('dist')));

function lint(files, options) {
  return () => gulp.src(files)
    .pipe($.eslintNew(options))
    .pipe($.eslintNew.fix())
    .pipe($.eslintNew.format())
    .pipe($.eslintNew.failAfterError());
}

gulp.task('lint', lint(['app/scripts.babel/**/*.js', 'proxy/**/*.js'], {
  overrideConfig: {
    env: {
      es6: true,
    },
  },
  fix: true,
}));

gulp.task('images', () => gulp.src('app/images/**/*')
  .pipe($.if($.if.isFile, $.cache($.imagemin({
    progressive: true,
    interlaced: true,
    // don't remove IDs from SVGs, they are often used
    // as hooks for embedding and styling
    svgoPlugins: [{ cleanupIDs: false }],
  }))
    .on('error', function onError(err) {
      console.log(err);
      this.end();
    })))
  .pipe(gulp.dest('dist/images')));

gulp.task('html', () => gulp.src('app/*.html')
  .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
  .pipe($.sourcemaps.init())
  .pipe($.if('*.js', $.terser()))
  .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
  .pipe($.sourcemaps.write())
  .pipe($.if('*.html', $.htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  })))
  .pipe(gulp.dest('dist')));

gulp.task('chromeManifest', async () => {
  const cwd = process.cwd();
  gulp.src('app/manifest.json', { base: 'app' })
    .pipe($.chromeManifest({
      buildnumber: true,
      background: {
        target: 'scripts/background.js',
      },
    }))
    .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
    .pipe($.if('*.js', $.sourcemaps.init()))
    .pipe($.if('*.js', $.terser()))
    .pipe($.if('*.js', $.sourcemaps.write('.')))
    .pipe(gulp.dest('dist', { cwd }));
});

gulp.task('babel', async () => {
  const files = [
    'background.js',
  ];

  const tasks = files.map((file) => (
    browserify({
      entries: `./app/scripts.babel/${file}`,
      debug: true,
    }).transform('babelify', { presets: ['@babel/preset-env'] })
      .transform('aliasify', {
        aliases: {
          net: 'net-browserify',
        },
        global: true,
      })
      .transform('@sethvincent/dotenvify', {
        path: 'public.env',
      })
      .bundle()
      .pipe(source(file))
      .pipe(gulp.dest('app/scripts'))
  ));

  return es.merge.apply(null, tasks);
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', gulp.series('lint', 'babel'), () => {
  $.livereload.listen();

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json',
  ]).on('change', $.livereload.reload);

  gulp.watch('app/scripts.babel/**/*.js', ['lint', 'babel']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('size', () => gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true })));

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('package', async () => {
  const manifest = require('./dist/manifest.json');
  gulp.src('dist/**')
    .pipe($.zip(`keyboardle-${manifest.version}.zip`))
    .pipe(gulp.dest('package'));
});

gulp.task('build', gulp.series(
  'lint',
  'babel',
  'chromeManifest',
  gulp.parallel('html', 'images', 'extras'),
  'size',
));

gulp.task('default', gulp.series('clean', 'build'));
