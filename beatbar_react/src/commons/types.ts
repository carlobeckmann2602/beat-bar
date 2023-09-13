export type Song = {
  title: string;
  artist: string;
  url: string;
  song_id: string;
  duration: number;
  key: string;
  scale: string;
  key_scale_strength: number;
  bpm: number;
  energy: number;
  danceability: number;
};

export type SongResponse = {
  "song_id": string,
  "duration": number,
  "key": string,
  "scale": string,
  "key_scale_strength": number,
  "bpm": number,
  "energy": number,
  "danceability": number
}

export type AllSongsUrls = {
  [key: string]: string;
};

export enum MOODS {
  sad = "sad",
  chill = "chill",
  focused = "focused",
  happy = "happy"
}

export enum BeatbarPlayerErrorNames {
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
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