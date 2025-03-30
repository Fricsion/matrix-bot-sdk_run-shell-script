`matrix-bot-sdk` is a set of tools provided for bot creation. 

But I found the documentation very hard to navigate. 
For example, there are no such simple instruction to have encryption. 

I made this repository to help someone who is having a hard time figuring out encrypted rooms with `matrix-bot-sdk`.
In my testing, the bot works flawlessly in public rooms (without encryption). 
But private rooms & DMs (with encryption) are real headache.

First, you can clone this repo and fill out necessary environment variables in `.env` then `docker compose up --build`.

From there, you can just play with it as it is. Or inspect the `src` directory for how it works. 

One caveat is that to run the bot for the first time, 'Open Registration' must be enabled on your choice of Matrix Homeserver. And it's different from 'allow registration'.

# Running for the first time
1. Clone this repo to your computer. 
1. Edit `.env`
    1. `BOT_USERNAME` & `BOT_PASSWORD` can be anything since this is the first time.
1. Now `docker compose up --build`
1. Open your Matrix client. try sending a DM using the bot username specified in `.env` file.
1. Send '!hello' to the bot. 
1. You will get 'Hello World' in return. 