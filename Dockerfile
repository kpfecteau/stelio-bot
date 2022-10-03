FROM node:18
ENV NODE_ENV=production
ENV DISCORD_TOKEN=${DISCORD_TOKEN}
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent
COPY . .
RUN chown -R node /usr/src/app
USER node
CMD ["node", "index.js"]
