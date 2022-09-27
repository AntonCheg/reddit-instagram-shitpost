import axios from 'axios';
import { IgApiClient } from 'instagram-private-api';

import { getPublicationsList } from './api';
import { PublicationApiResponseType } from './types';

const getHashtag = () => {
  return ` ${process.env.HASHTAGS}`.replace(/\s/g, ' #').trim();
};

export const initInstagramClient = async () => {
  const ig = new IgApiClient();

  ig.state.generateDevice(process.env.IG_USERNAME!);

  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  const pub = await getPublicationsList(process.env.SUBREDDIT!);
  const upload = async (post: PublicationApiResponseType) => {
    const buffer = (
      await axios({
        url: post.url,
        responseType: 'arraybuffer',
      })
    ).data;
    try {
      await ig.publish.photo({
        file: buffer,
        caption: `${
          post.title
        } \n\n\nFollow @reddit.fresh.memes\nFollow @reddit.fresh.memes\nFollow @reddit.fresh.memes\n.\n.\n.\n.\n.\n${getHashtag()}`,
      });

      console.log('SUCCESS');
    } catch (err) {
      console.error(err);
      console.log('ERROR');
    }
  };

  const rec = async (_posts) => {
    if (!_posts?.length) {
      return true;
    }

    const [first, ...other] = _posts;

    await upload(first);

    return setTimeout(() => rec(other), 30000);
  };

  return rec(pub);
};
