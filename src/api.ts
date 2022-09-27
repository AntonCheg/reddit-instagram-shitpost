import axios from 'axios';
import { filter, map, omit } from 'lodash';

import { Publication } from './db/entity/publication.entity';
import { Subreddit } from './db/entity/subreddit.entity';
import { NormalizedPublicationType, PublicationApiResponseType } from './types';

export const getPublicationsList = async (subredditname: string, after?: string): Promise<NormalizedPublicationType[]> => {
  const response = await axios({
    url: `https://www.reddit.com/r/${subredditname}/top.json?after=${after}`,
    responseType: 'json',
  });
  const currentAfter = response.data.data.after;
  const isExist = await Publication.findBy({ name: currentAfter });

  if (isExist) {
    return getPublicationsList(subredditname, currentAfter);
  }

  const publications: PublicationApiResponseType[] = filter(map(response.data.data.children, 'data'), { is_video: false });

  return map(publications, (obj) => ({
    ...omit(obj, 'is_video'),
    isVideo: obj.is_video,
  }));
};

export const uploadNewPublication = async () => {
  const subs = await Subreddit.find({ relations: { publications: true } });

  const sub = subs[(Math.random() * subs.length) | 0];

  const pubs = await getPublicationsList(sub.name);

  const newPubs = pubs.filter((pub) => !map(sub.publications, 'name').includes(pub.name));

  if (newPubs?.length) {
    await Publication.insert(map(newPubs, (newPub) => ({ ...newPub, subreddit: sub })));
  }
};
