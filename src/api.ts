import axios from "axios";
import { filter, map, omit } from "lodash";

import { NormalizedPublicationType, PublicationApiResponseType } from "./types";

export const getPublicationsList = async (
  subredditname: string
): Promise<NormalizedPublicationType[]> => {
  const response = await axios({
    url: `https://www.reddit.com/r/${subredditname}/top.json`,
    responseType: "json",
  });

  const publications: PublicationApiResponseType[] = filter(
    map(response.data.data.children, "data"),
    { is_video: false }
  );

  return map(publications, (obj) => ({
    ...omit(obj, "is_video"),
    isVideo: obj.is_video,
  }));
};
