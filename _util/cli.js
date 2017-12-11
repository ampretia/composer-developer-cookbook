const yargs = require('yargs');

function getArguments() {
    // Standard Command yargs processing.
    return yargs
        .option('i', {
            alias: 'enrollId',
            demandOption: false,
            default: 'admin',
            describe: 'enrollment id',
            type: 'string'
        })
        .option('s', {
            alias: 'enrollSecret',
            demandOption: false,
            default: 'adminpw',
            describe: 'Enrollment Secret',
            type: 'string'
        }).option('p', {
            alias: 'connectionProfile',
            demandOption: false,
            default: 'hlfv1',
            describe: 'Connection Profile',
            type: 'string'
        }).option('n', {
            alias: 'nework name',
            demandOption: false,
            default: 'composer-developer-cookbook',
            describe: 'Network name',
            type: 'string'
        })
        .strict()
        .help().argv;

}

module.exports = getArguments;