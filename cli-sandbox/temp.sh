#!/bin/bash
set -e


function ln(){
    printf '%s\n' --------------------
    echo $1
    $1
}


ln "composer archive create -t dir -a ${DIR}/network.bna -n _network"