FROM tylerthecoder/tt-services:latest AS base

# Install dependencies only when needed
FROM base AS deps
RUN apt add --no-cache libc6-compat
WORKDIR /app

# Copy root package.json and yarn.lock
COPY package.json yarn.lock ./

# Copy package.json files for web app and blog library
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY lib/blog/package.json ./lib/blog/

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the blog library
WORKDIR /app/lib/blog
RUN yarn build

# Build the main Next.js application
WORKDIR /app/apps/web
RUN yarn build

# Build the API
WORKDIR /app/apps/api
RUN yarn build

# Production image, copy all the files and run next
FROM base AS webui
WORKDIR /app/apps/web

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing

# Copy the built blog library
COPY --from=builder --chown=nextjs:nodejs /app/lib/blog/dist /app/lib/blog/dist

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
WORKDIR /app/apps/web/apps/web
CMD ["node", "server.js"]


FROM base AS api

WORKDIR /app/apps/api
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/lib/blog/dist /app/lib/blog/dist

EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production

CMD ["node", "./dist/main.js"]