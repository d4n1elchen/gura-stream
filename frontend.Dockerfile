FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy needed files
COPY common/ common/
COPY frontend/ frontend/
COPY tsconfig.base.json tsconfig.base.json

# install project dependencies
WORKDIR /app/frontend
RUN npm install

# build app for production with minification
# RUN npm run build

EXPOSE 8080
CMD [ "sh", "-c", "npm run build && http-server dist" ]

