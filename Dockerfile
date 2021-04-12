#Dockerfile for Backend

# pull official base image
FROM node:14-alpine

# RUN apk update && apk add python make g++

#Create a user
RUN addgroup app && adduser -S -G app app

# set working directory
WORKDIR /app

#IGNORE:
# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# RUN npm install -g sequelize-cli
RUN npm install sequelize-cli
# RUN npx sequelize-cli init
# RUN npx sequelize-cli db:create
RUN npx sequelize-cli db:migrate
RUN npx sequelize-cli db:seed:all

# add app
COPY . .

USER app

EXPOSE 3004

# start app
CMD ["npm", "start"]  
