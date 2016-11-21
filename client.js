const inquirer = require('inquirer');

const playAgainQuestion = [
  {
    type: 'confirm',
    name: 'playAgain',
    message: 'Do you want to play again?',
    default: true,
  },
];

function createTweetQuestion(tweetMessage) {
  return {
    type: 'confirm',
    name: 'tweetGuess',
    message: `Here's a tweet: ${tweetMessage}`,
    default: true,
  };
}

function getRandomTweet() {
  // TODO: Use GET /tweets
  const id = Math.floor(Math.random() * 10);
  const text = `Random tweet with ID ${id}`;

  return { id, text };
}

function getTweetAuthor(tweetId) {
  // TODO: Use GET /tweets/:tweet_id
  return `Mr. ${tweetId}`;
}

function game() {
  const tweet = getRandomTweet();
  const tweetQuestion = createTweetQuestion(tweet.text);

  inquirer.prompt(tweetQuestion)
    .then((answers) => [
      answers,
      getTweetAuthor(tweet.id),
    ])
    .then(([answers, tweetAuthor]) => {
      console.log(`You answered ${answers.tweetGuess}`);
      console.log(`The author is ${tweetAuthor}`);
    })
    .then(() => {
      inquirer.prompt(playAgainQuestion)
        .then((answers) => {
          if (answers.playAgain) {
            game();
          } else {
            console.log('Go out there and make America great!!');
          }
        });
    });
}

console.log('Welcome to Stump-A-Trump~');
game();
