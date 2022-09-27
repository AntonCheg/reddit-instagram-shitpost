export type PublicationApiResponseType = {
  is_video: boolean;

  url: string;

  name: string;

  title: string;

  ups: number;

  created: number;
};

export type NormalizedPublicationType = Omit<
  PublicationApiResponseType,
  "is_video"
> & { isVideo: boolean };
