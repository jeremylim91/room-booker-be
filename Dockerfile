# pull official base image
FROM node:13.12.0-alpine

RUN apk update && apk add python make g++


# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npx sequelize db:migrate
RUN npx sequelize db:seed:all

# add app
COPY . ./

EXPOSE 3004

# start app
CMD ["node", "index.mjs"]  
