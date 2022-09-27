FROM node:16 as base

WORKDIR /app
COPY package*.json  ./

RUN npm ci --production=true

FROM base as builder
WORKDIR /app
COPY . .
RUN npm ci --production=false
RUN npm run build

### Runner
FROM base
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
CMD npm run prod
