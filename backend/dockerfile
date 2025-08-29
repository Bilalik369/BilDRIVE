FROM node:18-alpine


WORKDIR /app


COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000


ENV NODE_ENV=production

CMD ["node", "server.js"]

