import axios from "axios";
import { filter, map } from "lodash";

import { PublicationType } from "./interface";

export const getPublicationsList = async (subredditname: string) => {
  const response = await axios({
    url: `https://www.reddit.com/r/${subredditname}/top.json`,
    responseType: "json",
  });

  const memeObject: PublicationType[] = filter(
    map(response.data.data.children, "data"),
    { is_video: false }
  );

  return memeObject;
};
