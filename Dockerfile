FROM node

ENV WORKDIR /usr/src/app
# ENV NPM npm --registry=https://registry.npm.taobao.org
ENV NPM npm

RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR
EXPOSE 4333
VOLUME $WORKDIR/data

COPY . $WORKDIR
RUN $NPM i && $NPM run predeploy && NODE_ENV=production $NPM prune
CMD npm start
