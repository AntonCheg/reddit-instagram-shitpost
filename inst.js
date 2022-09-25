const { IgApiClient } = require('instagram-private-api');
const { config } = require('dotenv');
const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');
const { join } = require('path');
const { keys, assign } = require('lodash');
const { customFromReddit, customFromRedditList } = require('./reddit-api');

config();

const getHashtag = () => {
  return ` ${process.env.HASHTAGS}`.replace(/\s/g, ' #').trim();
};

const checkPostedFile = () => {
  if (!fs.existsSync('./posted_memes.json')) {
    fs.writeFileSync('./posted_memes.json', '{}');
  }
};

const log = (message) => {
  console.log('_.'.repeat(30));
  console.log(`\n%c${message}\n`, 'color: red');
  console.log('_.'.repeat(30));
};

const isCorrectUrl = (url) => {
  const extension = url.split('.').slice(-1)[0];
  const allowed = ['jpg', 'jpeg', 'png'];

  return allowed.includes(extension);
};
class Insta {
  constructor() {
    this.proccesing = new Set();
    this.counter = 0;
    this.ig = new IgApiClient();
    this.postedPath = join('.', 'posted_memes.json');
    this.postedMemes = {};
    this.postedInMemory = {};
    this.ig.state.generateDevice(process.env.IG_USERNAME);
  }

  async login() {
    await this.ig.account.login(
      process.env.IG_USERNAME,
      process.env.IG_PASSWORD
    );
    await this.loadPosted();
  }

  async loadPosted() {
    const raw = await fs.promises.readFile(this.postedPath);
    this.postedMemes = JSON.parse(raw);
  }

  async writePosted() {
    const all = assign(this.postedInMemory, this.postedMemes);
    await fs.promises.writeFile(this.postedPath, JSON.stringify(all));
    this.postedMemes = all;
    this.postedInMemory = {};
  }

  getNameFromUrl(url) {
    return url.replace(/h.+\/|/, '').replace(/\.\w+/, '');
  }

  async getImage() {
    const id = (Math.random() * 1000) | 0;
    log(`Image metadata request. ID: ${id}`);
    const img = await customFromReddit({
      ...this.postedMemes,
      ...this.postedInMemory,
    }).then((data) => ({
      url: data.image,
      category: data.category,
      caption: data.caption,
      permalink: data.permalink,
    }));

    const name = this.getNameFromUrl(img.url);
    console.log('\n');
    console.log('='.repeat(100));
    console.log(img);
    console.log('='.repeat(100));
    console.log('\n');

    if (
      keys(this.postedMemes).includes(name) ||
      keys(this.postedInMemory).includes(name) ||
      !isCorrectUrl(img.url)
    ) {
      return this.getImage();
    }

    log(`Return image metadata request. ID: ${id}. Url - ${img.url}`);
    return { ...img, id };
  }

  async publish() {
    const data = await this.getImage();
    const name = this.getNameFromUrl(data.url);

    if (
      keys(this.postedMemes).includes(name) ||
      this.proccesing.has(data.url)
    ) {
      return false;
    }

    log(`Start download image with ID: ${data.id}.`);
    this.proccesing.add(data.url);
    const buffer = (
      await axios({
        url: data.url,
        responseType: 'arraybuffer',
      })
    ).data;
    log(`End download image with ID: ${data.id}.`);

    const { width, height } = await sharp(buffer).metadata();

    // const input = await sharp(buffer).resize(1080, 1080).toBuffer();
    try {
      log(`Start upload image with ID: ${data.id}.`);
      await this.ig.publish.photo({
        file: buffer,
        caption: `${
          data.caption
        } \nFollow @reddit.fresh.memes\nFollow @reddit.fresh.memes\nFollow @reddit.fresh.memes\n.\n.\n.\n.\n.\n${getHashtag()}`,
      });
      log(`End upload image with ID: ${data.id}.`);
      // console.warn(`width - ${width}, height - ${height}`);
      // console.warn(`SUCCES`);
      this.proccesing.delete(data.url);
      const ob = { [name]: data.url };
      assign(this.postedInMemory, ob);

      if (keys(this.postedInMemory).length > 10) {
        await this.writePosted();
      }
      return { [name]: data.url };
    } catch (e) {
      this.proccesing.delete(data.url);
      const ob = { [name]: data.url };
      assign(this.postedInMemory, ob);

      if (keys(this.postedInMemory).length > 10) {
        await this.writePosted();
      }
      console.error(e);
      console.warn(`width - ${width}, height - ${height}`);
      return await this.publish();
    }
  }

  async uploadToInst(data) {
    const buffer = (
      await axios({
        url: data.image,
        responseType: 'arraybuffer',
      })
    ).data;
    try {
      await this.ig.publish.photo({
        file: buffer,
        caption: `${
          data.caption
        } \n\n\nFollow @reddit.fresh.memes\nFollow @reddit.fresh.memes\nFollow @reddit.fresh.memes\n.\n.\n.\n.\n.\n${getHashtag()}`,
      });
      // console.warn(`width - ${width}, height - ${height}`);
      console.warn(`SUCCES - ${data.name}`);
      return true;
    } catch (e) {
      console.error(e);
      console.warn(`${data.name}`);
      return false;
    }
  }

  async publishSecond() {
    const posts = await customFromRedditList();

    const rec = async (_posts) => {
      if (!_posts?.length) {
        return true;
      }

      const [first, ...other] = _posts;

      await this.uploadToInst(first);

      setTimeout(() => rec(other), 30000);
    };

    return rec(posts.splice(4));
  }
}

module.exports = Insta;
