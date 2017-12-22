'use strict';

const IdCard = require('composer-common').IdCard;
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');


/**
 *
 * @param {*} cardFileName
 */
function readCardFromFile(cardFileName) {
    const cardFilePath = path.resolve(cardFileName);
    let cardBuffer;
    try {
        cardBuffer = fs.readFileSync(cardFilePath);
    } catch (cause) {
        const error = new Error(`Unable to read card file: ${cardFilePath}`);
        error.cause = cause;
        throw error;
    }

    return IdCard.fromArchive(cardBuffer);
}

/**
 *
 * @param {*} cardFileName
 * @param {*} card
 */
function writeCardToFile(cardFileName,card) {
    let cardFilePath;
    return card.toArchive({ type: 'nodebuffer' })
        .then( (cardBuffer)=>{
            // got the id card to write to a buffer
            cardFilePath = path.resolve(cardFileName);
            try {
                fs.writeFileSync(cardFilePath,cardBuffer);
            } catch (cause) {
                const error = new Error(`Unable to write card file: ${cardFilePath}`);
                error.cause = cause;
                return Promise.reject(error);
            }
        });
}

/** */
function LOG(){
    Array.from(arguments).forEach((s)=>{
        console.log(s);
    });

}


// -----------------------------------------------------------------------------
// main code starts here
(async () => {

    let results = yargs
        .help()
        .option('f', {
            alias: 'file',
            demandOption: true,
            describe: 'Card file to update',
            type: 'string',
            required : true
        })

        .option('l', {
            alias: 'hsmlib',
            demandOption: true,
            describe: 'HSM library path',
            type: 'string',
            required : true
        }).option('s', {
            alias: 'hsmslot',
            demandOption: true,
            default: 'config.yaml',
            describe: 'HSM slot',
            type: 'string',
            required : true
        })
        .option('p', {
            alias: 'hsmpin',
            demandOption: true,
            describe: 'HSM pin',
            type: 'string',
            required : true
        })
        .wrap(null)
        .strict()
        .argv;

    let card = await readCardFromFile(results.file);
    let hsmOptions = { library: results.hsmlib, slot: results.hsmslot, pin: results.hsmpin };

    let cp = card.getConnectionProfile();
    cp.hsm = hsmOptions;

    card.connectionProfile = cp;

    await writeCardToFile(results.file+'-hsm',card);


})();