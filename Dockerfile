FROM node:18.7
WORKDIR /usr/src/app
COPY package*.json .
RUN ["npm", "install"]
COPY . .
EXPOSE 3000
RUN ["npm", "run", "build"]
# use jwtPrivateKey as a commandline build argument
ARG jwtPrivateKey
# set the value of the env var according to the arg value above
ENV vidly_jwtPrivateKey ${jwtPrivateKey}