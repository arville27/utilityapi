#!/bin/bash

if [[ $1 == "arm64" ]]; then
    docker build -t utilityapi:arm64 -f docker/Dockerfile.arm64 .
elif [[ $1 == "amd64" ]]; then
    docker build -t utilityapi:amd64 -f docker/Dockerfile.arm64 .
else
    echo "Specify platform [ arm64 | amd64 ]"
fi
