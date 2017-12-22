#!/bin/bash

set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/." && pwd )"

NAME=basic-sample-network

composer archive create --archiveFile  ${DIR}/${NAME}.bna --sourceType dir --sourceName ${DIR}/${NAME}