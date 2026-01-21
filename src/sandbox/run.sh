#!/bin/sh
set -e

cd /sandbox

gcc main.c -o program 2>&1
./program < input.txt > output.txt 2>&1
