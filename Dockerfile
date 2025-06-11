# Build stage
# FROM oven/bun:1 AS base
# WORKDIR /app

# COPY . .
# RUN bun install
# RUN bun run build

# CMD ["bun", "run", "start"]

FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
COPY . .

RUN npm run build


CMD ["npm", "run", "start"]
