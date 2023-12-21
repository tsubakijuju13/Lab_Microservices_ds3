FROM node:slim

WORKDIR /app

COPY package*.json pnpm-lock.yaml /app/

RUN npm install -g pnpm
# RUN pnpm config set strict-ssl false 

# RUN pnpm install

RUN --mount=type=cache,id=pnmcache,target=/pnpm_store \
  pnpm config set store-dir /pnpm_store && \
  pnpm config set package-import-method copy && \
  pnpm config set strict-ssl false && \
  pnpm install --prefer-offline --ignore-scripts --frozen-lockfile

COPY . .

EXPOSE 4000

CMD ["pnpm", "start"]
