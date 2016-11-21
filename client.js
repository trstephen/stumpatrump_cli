const inquirer = require('inquirer');
let correctGuessCount = 0;
let totalGames = 0;

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
    name: 'isTrumpGuess',
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
  return {
    screen_name: `Mr. ${tweetId}`,
    isTrump: Math.random() > 0.5,
  };
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
      const isCorrectGuess = answers.isTrumpGuess === tweetAuthor.isTrump;

      console.log(`The author is ${tweetAuthor.screen_name}`);

      const feedbackMsg = isCorrectGuess ? 'Beautiful. Amazing.' : 'Sad!';
      console.log(feedbackMsg);

      totalGames += 1;
      if (isCorrectGuess) correctGuessCount += 1;

      console.log(`Your score is ${correctGuessCount}/${totalGames}`);
    })
    .then(() => {
      inquirer.prompt(playAgainQuestion)
        .then((answers) => {
          if (answers.playAgain) {
            game();
          } else {
            console.log(`Your final score is ${correctGuessCount}/${totalGames}`);
            console.log('Go out there and make America great!!');
          }
        });
    });
}

console.log('Welcome to Stump-A-Trump~');
game();
