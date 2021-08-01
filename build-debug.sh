#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

mkdir /tmp/web-app_build/
rsync -av --progress "$SCRIPT_DIR"/app/ /tmp/web-app_build/ --exclude dist --exclude node_modules 

(cd /tmp/web-app_build/ || exit; npm i; npm run dev)

rm "$SCRIPT_DIR"/app/dist/*
rsync -av --progress /tmp/web-app_build/dist/ "$SCRIPT_DIR"/app/dist/