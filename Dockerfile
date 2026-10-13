# Frontend: build the static survey with Vite, then serve it with Nginx.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts survey.config.json ./
COPY src ./src
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY ops/docker/nginx.conf /etc/nginx/conf.d/default.conf
# Vite builds with base '/survey/', so the files live under that path.
COPY --from=build /app/dist /usr/share/nginx/html/survey
EXPOSE 8080
