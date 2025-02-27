FROM node:20.18-alpine AS base

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM node:20.18-alpine AS prod

WORKDIR /app

COPY --from=builder /app/dist /app

COPY --from=builder /app/public /app/public

COPY --from=builder /app/serve.json /app/serve.json

RUN npm install -g serve

ENV NODE_ENV=production

EXPOSE 4173
ENV PORT=4173
ENV HOSTNAME="0.0.0.0"

CMD ["serve", "-s", "/app"]