import gulp from 'gulp'
import requireDir from 'require-dir'
import FwdRef from 'undertaker-forward-reference';

gulp.registry(FwdRef());
requireDir('./tasks')