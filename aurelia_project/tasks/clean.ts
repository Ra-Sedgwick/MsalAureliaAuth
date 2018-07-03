import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as project from '../aurelia.json';
import * as rename from 'gulp-rename';
import * as merge from 'merge-stream';
import * as del from 'del';

export default function clean() {
    return del(['scripts', 'drop_folder']);
}