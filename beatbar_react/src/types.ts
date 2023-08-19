export type Song = {
  title: string;
  artist: string;
  url: string;
  length?: string;
};

export type AllSongsUrls = {
  [key: string]: string;
};
export const ALL_SONGS = [
  {
    title: "Embrace",
    artist: "ItsWatR",
    url: "http://localhost:3001/embrace_itswatr.mp3",
    length: "2:22",
  },
  {
    title: "Spirit Blossom",
    artist: "RomanBelov",
    url: "http://localhost:3001/spirit-blossom_roman-belov.mp3",
  },
  {
    title: "LoFi Chill (Medium Version)",
    artist: "BoDleasons",
    url: "http://localhost:3001/lofi-chill-medium-version_bo-dleasons.mp3",
  },
  {
    title: "Lofi Study",
    artist: "FASSounds",
    url: "http://localhost:3001/lofi-study_fassounds.mp3",
  },
  {
    title: "Storm Clouds",
    artist: "Purple Cat",
    url: "http://localhost:3001/storm-clouds_purpple-cat.mp3",
  },
  {
    title: "Watr-Fluid",
    artist: "ItsWatR",
    url: "http://localhost:3001/watr-fluid_itswatr.mp3",
  },
];

export enum MOODS {
  sad = "sad",
  chill = "chill",
  focused = "focused",
  happy = "happy"
}

export enum BeatbarPlayerErrorNames {
  INTERNAL_SERVER_ERROR= 'Internal Server Error',
  RESOURCE_NOT_FOUND = 'Resource not found',
  AUTHENTICATION_ERROR = 'Authentication Error',
  AUTHORIZATION_ERROR = 'Authorization Error',
  UNKNOWN_ERROR = 'Unknown Error'
}

export type BeatbarPlayerError = {
  code: number,
  name: BeatbarPlayerErrorNames,
  description: string,
  isFatal: boolean
}