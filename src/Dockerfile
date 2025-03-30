FROM node:23-bookworm

# Install your choice of tools required for your script.
RUN apt-get update && \
    apt-get install -y curl ffmpeg exiftool && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

# yt-music.shを実行可能にする
RUN chmod a+rx ./yourscript.sh

RUN npm install -g typescript
RUN npx tsc *.ts

CMD ["node", "index.js"]
