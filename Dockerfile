FROM node:13.12.0-alpine

COPY . /app
WORKDIR /app
CMD node index.mjs