#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

mode='dev'
while getopts 'p' flag; do
    case "${flag}" in
        p) mode='prod';;
		*) printf '\nUsage: %s: [-p]roduction\n' "$0"; exit 2 ;;
    esac
done

mkdir /tmp/web-app_build/
rsync -av --progress "$SCRIPT_DIR"/app/ /tmp/web-app_build/ --exclude dist --exclude node_modules 

(cd /tmp/web-app_build/ || exit; npm i; npm run "$mode")

rm "$SCRIPT_DIR"/app/dist/*
rsync -av --progress /tmp/web-app_build/dist/ "$SCRIPT_DIR"/app/dist/