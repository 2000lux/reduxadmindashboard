FROM node:8.1.2

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN npm install

ENV PATH /app/node_modules/.bin:$PATH


