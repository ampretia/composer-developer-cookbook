#!/bin/bash

set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/." && pwd )"

NAME=multi-purpose
composer archive create --archiveFile  ${DIR}/${NAME}.bna --sourceType dir --sourceName ${DIR}/${NAME}