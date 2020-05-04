# Sports Events Mobile App

An app concentrates on creating sports events, but also has another options such as rating players in given sport category.

![](https://s6.gifyu.com/images/login-resize.png)
![](https://s6.gifyu.com/images/profile-resize.gif)
![](https://s6.gifyu.com/images/events-resize.gif)

## Technologies

Client
* React Native 0.61.4
* Expo SDK 36
* Axios 0.19.2

Server
* Node 12.10.0
* Express 4.16.2
* Mongoose 5.6.7
* Joi 15.1.0

## How to run?

```bash
# Clone or download this repository
$ git clone https://github.com/voyyy/SportsEvents.git
# Go into the repository
$ cd SportsEvents
# Install dependencies on client side
$ npm install
# Go into the repository
$ cd server
# Install dependencies on server side
$ npm install
# Run server
$ npm start
# Back to last repository
$ cd ..
# Run client
$ npm start
```

On server side you need to paste your connection string to mongoDB in .env file.
On client side you need to change every endpoint url in files to your which is forwading to your localhost 5000 (I was using ngrok).
