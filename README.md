# React Spectator Tic Tac Toe

This is a front end spectator for my [Clojure Tic Tac
Toe](https://github.com/pelensky/clojure_ttt).

A user can watch an ongoing game in their browser. 

#### Prerequisites 
1. Install
[Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
2. Install [Homebrew](https://brew.sh/) by running `$ /usr/bin/ruby -e
"$(curl -fsSL
https://raw.githubusercontent.com/Homebrew/install/master/install)"`
3. Install [Clojure](https://clojure.org/guides/getting_started) by
running `$ brew install clojure`
4. Install [Leiningen](https://leiningen.org/) by running `$ brew install leiningen`
5. Download and install [NodeJS](https://nodejs.org/en/)

#### Clojure Tic Tac Toe Running instructions
1. Clone the [Clojure Tic Tac Toe repository](https://github.com/pelensky/clojure_ttt) by clicking on the green "Clone or Download"
button
2. Select Download Zip
3. Double click the zip file to unzip it
4. In terminal, CD into the repository
5. Create an [AWS account](https://aws.amazon.com/) 
6. Set the following Environment Variables. I use
[EnvPane](https://github.com/hschmidt/EnvPane).
`AWS_ACCOUNT_ID`, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_KEY`.
7. Run the app with `$ lein run`
9. Choose Player

#### Spectator Running instructions
1. Clone this repository by clicking on the green "Clone or Download"
button
2. Select Download Zip
3. Double click the zip file to unzip it
4. In a new terminal window, CD into the repository
5. Set the following Environment Variable. I use
[EnvPane](https://github.com/hschmidt/EnvPane).
`AWS_REGION`.
7. Run the app with `$ npm run watch`
8. In a browser, navigate to `localhost:8080`
9. Play the game in the Clojure window - the moves will appear in the browser
   window

#### The Rules

The rules of tic-tac-toe are as follows:

* There are two players in the game (X and O)
  * Players take turns until the game is over
  * A player can claim a field if it is not already taken
  * A turn ends when a player claims a field
  * A player wins if they claim all the fields in a row, column
  or diagonal
  * A game is over if a player wins
  * A game is over when all fields are taken
