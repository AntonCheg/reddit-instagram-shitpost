import axios from 'axios';
import { IgApiClient } from 'instagram-private-api';

import { uploadNewPublication } from './api';
import { Publication, PublicationPostedStatusEnum } from './db/entity/publication.entity';

const getHashtag = () => {
  return ` ${process.env.HASHTAGS}`.replace(/\s/g, ' #').trim();
};

export const initInstagramClient = async () => {
  const ig = new IgApiClient();

  ig.state.generateDevice(process.env.IG_USERNAME!);

  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  const upload = async () => {
    let pub = await Publication.findPending();
    if (!pub) {
      uploadNewPublication();
      pub = await Publication.findPending();
    }
    const buffer = (
      await axios({
        url: pub.url,
        responseType: 'arraybuffer',
      })
    ).data;
    try {
      await ig.publish.photo({
        file: buffer,
        caption: `${
          pub.title
        } \n\n\nFollow @reddit.fresh.memes\nFollow @reddit.fresh.memes\nFollow @reddit.fresh.memes\n.\n.\n.\n.\n.\n${getHashtag()}`,
      });

      pub.postedStatus = PublicationPostedStatusEnum.SUCCESS;
      await pub.save();
    } catch (err) {
      pub.postedStatus = PublicationPostedStatusEnum.ERROR;
      await pub.save();
      console.error(err);
      console.log('ERROR');
    }
  };

  return upload;
};
