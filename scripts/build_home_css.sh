#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
npx --yes --package tailwindcss@3.4.17 tailwindcss -c tailwind.config.cjs -i assets/home.tailwind.css -o assets/home.css --minify
