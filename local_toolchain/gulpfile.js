

'use strict';

/**
 * Running single docker container rebuild
 * https://staxmanade.com/2016/09/how-to-update-a-single-running-docker-compose-container/
 *
 * docker-compose up -d --no-deps --build <service_name>
 */


// grab our gulp packages
let gulp  = require('gulp');
let usage = require('gulp-help-doc');
let run = require('gulp-run-command').default;
const path= require('path');
const getTools_sh = path.resolve(__dirname,'getTools.sh');
const startFabric_sh = path.resolve(__dirname,'fabric-tools','startFabric.sh');
const createPeerAdminCard = path.resolve(__dirname,'fabric-tools','createPeerAdminCard.sh');

const jsome = require('jsome');
/**
 * This simply defines help task which would produce usage
 * display for this gulpfile. Simple run `gulp help` to see how it works.
 * NOTE: this task will not appear in a usage output as far as it is not
 * marked with the @task tag.
 */
gulp.task('help' , function() {


    return usage(gulp); });

/**
 * We may also link usage as default gulp task:
 */
gulp.task('default', ['help']);



gulp.task('setup', () => {
    let fn = run(getTools_sh);
    return fn();
});

/**
 * Starts a local docker-compose based Fabric based on the current set of tools
 * @task
 */
gulp.task('provision', run([startFabric_sh,createPeerAdminCard]));


/**
 * @task
 */
gulp.task('env', ()=>{
    console.log('Environment being used:');

    let nodecfg = JSON.parse(process.env.NODE_CONFIG);
    console.log('Composer - Wallet configuration');
    jsome(nodecfg.composer.wallet);

    console.log('Composer - Loggining configuration');
    if (nodecfg.composer.log) {
        jsome(nodecfg.composer.log);
    } else {
        console.log('None specified, will use default of ');
    }

});