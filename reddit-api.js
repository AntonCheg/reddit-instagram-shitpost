const axios = require('axios');
const { config } = require('dotenv');
config();

const getHour = (number) => 1000 * 60 * 60 * number;
const interval = getHour(process.env.INTERVAL);
const time = getHour(process.env.TIME);
const isCorrectUrl = (url) => {
  const extension = url.split('.').slice(-1)[0];
  const allowed = ['jpg', 'jpeg', 'png'];

  return allowed.includes(extension);
};

const customFromReddit = async (postedMemes) => {
  subredditname = process.env.SUBREDDIT || 'dankmemes';

  let response = await axios({
    url: 'https://www.reddit.com/r/' + subredditname + '/top.json?limit=100',
    responseType: 'json',
  });
  let memeObject = await response.data;

  const posted = Object.values(postedMemes);
  const candidates = memeObject.data.children.filter(
    ({ data: { url } }) => !posted.includes(url) && isCorrectUrl(url)
  );

  if (!candidates.length) {
    console.log('NOT AVAILABLE MEMES');
    process.exit(0);
  }

  let postID = await candidates[Math.floor(Math.random() * candidates.length)];
  let meme = {
    image: postID.data.url,
    category: postID.data.link_flair_text,
    caption: postID.data.title,
    permalink: postID.data.permalink,
  };

  return meme;
};

// const test = async () => {
//   let response = await axios({
//     url: 'https://www.reddit.com/r/' + 'funnyvideos' + '/top.json?limit=100',
//     responseType: 'json',
//   });
//   const items = response.data.data.children;
//   console.log(items);
// };

// test();

class ApiHelper {
  #api;

  #limit = 5;

  #after = null;

  getAxios() {
    const url =
      'https://www.reddit.com/r/' +
      subredditname +
      `/hot.json?limit=${this.#limit}&after=${this.#after}`;
    return new axios.Axios({ url, responseType: 'json' });
  }
  constructor() {
    // this.#api = new axios.Axios({ url, responseType: 'json' });
  }

  getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async request() {
    const subredditname = process.env.SUBREDDIT || 'dankmemes';

    const url =
      'https://www.reddit.com/r/' +
      subredditname +
      `/hot.json?limit=${this.#limit}&after=${this.#after}`;

    const response = await axios({ url, responseType: 'json' });
    const jsonData = response.data.data.children.map(
      ({ data: { name, ups, url_overridden_by_dest, url, title } }) => ({
        name,
        ups,
        title,
        url_overridden_by_dest,
        url,
      })
    );

    const last = jsonData.slice(-1)[0];

    this.#after = response.data.data.after;

    const random = this.getRandom(jsonData);

    console.log(random);

    // this.#after=
  }
}
// name, ups, url_overridden_by_dest, url;

async function main() {
  const a = new ApiHelper();

  await a.request();
  let aa = setInterval(() => a.request(), 1000 * 10);

  setTimeout(() => clearInterval(aa), 1000 * 40);
}

// main();
module.exports = customFromReddit;
