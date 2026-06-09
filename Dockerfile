FROM node:24-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --prefer-offline --no-audit --legacy-peer-deps
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/log/nginx

EXPOSE 80

CMD ["nginx"]
