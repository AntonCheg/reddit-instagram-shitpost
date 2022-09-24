const Insta = require('./inst');
const { config } = require('dotenv');
config();

const getHour = (number) => 1000 * 60 * 60 * number;
const interval = getHour(process.env.INTERVAL);
const time = getHour(process.env.TIME);

const main = async () => {
  const insta = new Insta();
  await insta.login();

  const post = async () => {
    await insta.publish();
  };

  await post();

  let a = setInterval(post, 30000);

  setTimeout(() => clearInterval(a), time);
};

main();
