FROM node:20 AS build
WORKDIR /app/
COPY package.json package-lock.json /app/
RUN npm install
COPY tsconfig.json webpack.config.js /app/
COPY dist/index.html dist/favicon.svg /app/dist/
COPY src /app/src
RUN npx webpack

FROM python:3.11.3
COPY --from=build /app/dist /web
COPY routes.py /
RUN python3 routes.py
CMD python3 -m http.server -d /web
