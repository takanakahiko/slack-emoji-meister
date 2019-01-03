import gulp from 'gulp'
import c from 'ansi-colors'
import log from 'fancy-log'
import zip from 'gulp-zip'
import packageDetails from '../package.json'
import args from './lib/args'

function getPackFileType () {
  switch (args.vendor) {
    case 'firefox':
      return '.xpi'
    default:
      return '.zip'
  }
}

gulp.task('pack', gulp.series('build', () => {
  let name = packageDetails.name
  let version = packageDetails.version
  let filetype = getPackFileType()
  let filename = `${name}-${version}-${args.vendor}${filetype}`
  return gulp.src(`dist/${args.vendor}/**/*`)
    .pipe(zip(filename))
    .pipe(gulp.dest('./packages'))
    .on('end', () => {
      let distStyled = c.magenta(`dist/${args.vendor}`)
      let filenameStyled = c.magenta(`./packages/${filename}`)
      log(`Packed ${distStyled} to ${filenameStyled}`)
    })
}))
