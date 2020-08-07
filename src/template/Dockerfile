# develop stage
FROM node:12.14.0-alpine as develop-stage
WORKDIR /template
COPY package*.json ./
RUN yarn
ADD . .

# build stage
FROM node:12.14.0-alpine as build-stage
WORKDIR /template
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build

# Production stage
FROM nginx:1.16.1-alpine as production-stage
COPY --from=build-stage /template/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;"]