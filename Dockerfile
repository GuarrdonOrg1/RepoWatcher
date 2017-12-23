FROM mhart/alpine-node:latest

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json /app/

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps

RUN npm install

# Bundle app source
COPY /dist/. /app/dist/

EXPOSE 3005
CMD [ "npm", "start" ]