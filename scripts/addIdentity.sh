#!/bin/bash
set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

echo Issuing Identity for ID $1 [$2] using $3 credentials
echo composer identity issue -p hlfv1 -n dpn-scenario -i $3 -s elephant -u $1 -a $2 --issuer 
composer identity issue -p hlfv1 -n dpn-scenario -i $3 -s elephant -u $1 -a $2 --issuer | tee alice.tmp 

SECRET="$(awk -F= '/userSecret/ {gsub(/[ \t]+/, "", $2);print $2;} ' alice.tmp)"  
echo $SECRET
composer network ping -p hlfv1 -n dpn-scenario -i $1 -s $SECRET
rm alice.tmp