# Create image based on the official Node 6 image from the dockerhub
FROM node:latest

# Create a directory where our app will be placed
RUN mkdir -p /usr/src

RUN npm install nodemon -g

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src

# Copy dependency definitions
COPY . /usr/src/app
COPY package.json /usr/src

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY nodemon.json /usr/src/nodemon.json

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD npm start
