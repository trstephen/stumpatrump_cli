const inquirer = require('inquirer');
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
  console.log('Here’s a random tweet');
  console.log(tweet.text);

  inquirer.prompt(questions.tweetAuthenticity)
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
}

console.log('Welcome to Stump-A-Trump~');
game();
