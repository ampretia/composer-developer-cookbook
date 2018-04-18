'use strict';
const _ = require('lodash');

/**
 *
 * @param {String} input input String
 */
function updateString(input) {
    return _.snakeCase(input);
}

