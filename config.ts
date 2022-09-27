import { config } from 'dotenv';

config();
const configs = {
  HASHTAGS: process.env.HASHTAGS,
  USERNAME: process.env.IG_USERNAME,
  PASSWORD: process.env.IG_PASSWORD,
  SUBREDDIT: process.env.SUBREDDIT,
};

export default configs;
