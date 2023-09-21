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
  cuepoint_in: number;
  cuepoint_out: number;
};

export type SongResponse = {
  "song_id": string,
  "duration": number,
  "key": string,
  "scale": string,
  "key_scale_strength": number,
  "bpm": number,
  "energy": number,
  "danceability": number,
  "cuepoint_in": number,
  "cuepoint_out": number
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

export const HALFTONES_MAP: {[key: string]: number} = {
  'ces' : 11,
  'Cb' : 11,
  'C' : 0,
  'c' : 0,
  'C#' : 1,
  'cis' : 1,

  'des' : 1,
  'Db' : 1,
  'D' : 2,
  'd' : 2,
  'D#' : 3,
  'dis' : 3,

  'es' : 3,
  'Eb' : 3,
  'E' : 4,
  'e' : 4,
  'E#' : 5,
  'eis' : 5,

  'fes' : 4,
  'Fb' : 4,
  'F' : 5,
  'f' : 5,
  'F#' : 6,
  'fis' : 6,

  'ges' : 6,
  'Gb' : 6,
  'G' : 7,
  'g' : 7,
  'G#' : 8,
  'gis' : 8,

  'as' : 8,
  'Ab' : 8,
  'A' : 9,
  'a' : 9,
  'A#' : 10,
  'ais' : 10,

  'bes' : 10,
  'Bb' : 10,
  'B' : 11,
  'b' : 11,
  'B#' : 0,
  'his' : 0
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