#!/usr/bin/env bash

TARGET="4-94"

# remove the old container
sudo docker ps -a | \
grep exim-${TARGET} | \
awk '{ print $1; }' | \
xargs sudo docker rm -f 2>/dev/null

# rebuild the image
sudo docker build -t exim-${TARGET} /project/docker/exim-${TARGET}.d

# create a new container and start it
sudo docker run -v /project/scripts/exim:/root/scripts \
--name exim-${TARGET} \
--cap-add=SYS_PTRACE --security-opt seccomp=unconfined \
-p 127.0.0.1:25:25/tcp -d exim-${TARGET}

# spawn an interactive shell inside the container
sudo docker exec -it exim-${TARGET} /bin/zsh
