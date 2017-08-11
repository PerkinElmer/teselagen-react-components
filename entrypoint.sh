apk add --no-cache bash git &&
npm install -g yarn &&
yarn global add github-webhook &&
yarn global add serve &&
cd /app && git checkout package.json && rm -rf ./app/.babelrc && yarn
git pull origin master &&
cd /app && yarn buildWithDemo &&
serve -p 3333 /app/demo/dist
