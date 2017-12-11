#!/bin/bash
set -ev
P=$(docker images dev-* -q)
if [ "${P}" != "" ]; then
  echo "Removing images"  &2> /dev/null
  docker rmi ${P} -f
fi

cd  /home/matthew/github/composer/packages/composer-runtime-hlfv1 && npm run prepublish && cd -

cd  /home/matthew/github/composer/packages/composer-common && npm run regenmodel && cd -
