FROM node:0.10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#RUN npm install -g grunt-cli bower # add other tools that you use too, e.g. `gulp`

#RUN groupadd -r node \
#&&  useradd -r -m -g node node

COPY . /usr/src/app/
RUN chown -R node:node /usr/src/app

USER node
RUN npm install #\
 #&& grunt build # required for staging

ENV NODE_ENV development # production for staging
CMD [ "npm", "start" ]
EXPOSE 8080
