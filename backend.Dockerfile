FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy needed files
COPY common/ common/
COPY backend/ backend/
COPY tsconfig.base.json tsconfig.base.json

# install project dependencies
WORKDIR /app/backend
RUN npm install

# build app for production with minification
RUN npm run build

EXPOSE 8080
CMD [ "node", "dist/server.js" ]
