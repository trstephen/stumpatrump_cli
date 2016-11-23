const inquirer = require('inquirer');
const axios = require('axios');
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
      console.log(tweet.text);

      return tweet;
    })
    .then(tweet => getTweetAuthor(tweet.id))
    .then(tweetAuthor => {
      inquirer.prompt(questions.tweetAuthenticity)
        .then(answers => {
          const isCorrectGuess = answers.isTrumpGuess === tweetAuthor.isTrump;

          console.log(`The author is ${tweetAuthor.screenName}`);

          const feedbackMsg = isCorrectGuess ? 'Beautiful. Amazing.' : 'Sad!';
          console.log(feedbackMsg);

          totalGames += 1;
          if (isCorrectGuess) correctGuessCount += 1;

          console.log(`Your score is ${correctGuessCount}/${totalGames}`);
        })
        .then(() => {
          inquirer.prompt(questions.playAgain)
            .then((answers) => {
              if (answers.playAgain) {
                game();
              } else {
                console.log(`Your final score is ${correctGuessCount}/${totalGames}`);
                console.log('Go out there and make America great!!');
              }
            });
        });
    })
    .catch(console.error);
}

console.log('Welcome to Stump-A-Trump~');
console.log('Here’s a random tweet');
game();
