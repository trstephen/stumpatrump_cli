const inquirer = require('inquirer');
const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');
let correctGuessCount = 0;
let totalGames = 0;

const questions = {
  tweetAuthenticity: [
    {
      type: 'confirm',
      name: 'isTrumpGuess',
      message: 'Is this a tweet from Donald Trump?',
      default: true,
    },
  ],
  playAgain: [
    {
      type: 'confirm',
      name: 'playAgain',
      message: 'Do you want to play again?',
      default: true,
    },
  ],
};

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

function getRandomTweet() {
  return service.get('/tweets')
    .then(resp => {
      if (resp.status !== 200) throw new Error('Non-200 response from Twitter API');

      return resp.data;
    });
}

function getTweetAuthor(tweetId) {
  return service.get(`/tweets/${tweetId}`)
    .then(resp => {
      if (resp.status !== 200) throw new Error('Non-200 response from Twitter API');

      return resp.data;
    });
}

function game() {
  getRandomTweet()
    .then(tweet => {
      const tweetTime = moment(tweet.create_at).format('MMM Do YYYY, h:mm:ss a');
      console.log(`\n${tweet.text}`);
      console.log(chalk.dim(tweetTime));

      return tweet;
    })
    .then(tweet => getTweetAuthor(tweet.id))
    .then(tweetAuthor => {
      inquirer.prompt(questions.tweetAuthenticity)
        .then(answers => {
          const isCorrectGuess = answers.isTrumpGuess === tweetAuthor.isTrump;

          totalGames += 1;
          if (isCorrectGuess) correctGuessCount += 1;

          const feedbackMsg = isCorrectGuess
            ? chalk.green('Beautiful. Amazing.')
            : chalk.red('Sad!');

          console.log(`The author is @${tweetAuthor.screenName} ${feedbackMsg}`);
        })
        .then(() => {
          inquirer.prompt(questions.playAgain)
            .then((answers) => {
              if (answers.playAgain) {
                game();
              } else {
                console.log(`Your final score is ${correctGuessCount}/${totalGames}\n`);
                console.log(chalk.bold('Go out there and make America great!!\n'));
              }
            });
        });
    })
    .catch(console.error);
}

console.log(chalk.bold('Welcome to Stump-A-Trump'));
console.log('Which of these tweets are from President elect Donald J. Trump ' +
            'and which are from parody accounts?');

game();
