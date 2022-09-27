import axios from 'axios';
import { filter, map } from 'lodash';

import { Publication } from './interface';

/* eslint-disable functional/prefer-readonly-type */
export const getPublicationsList = async (subredditname: string) => {
  const response = await axios({
    url: `https://www.reddit.com/r/${subredditname}/top.json`,
    responseType: "json",
  });

  const memeObject: Publication[] = filter(
    map(response.data.data.children, "data"),
    { is_video: false }
  );

  return memeObject;
};
