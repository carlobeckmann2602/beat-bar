export const apiBaseUrl = process.env.REACT_APP_DEV_API_BASE_URL ?? 'http://localhost:8000/api/'

export const ALL_SONGS = [
  {
    title: "Bathroom - Chill Background Music",
    artist: "chillmore",
    url: "http://localhost:3001/bathroom-chill-background-music_chillmore.mp3"
  },
  {
    title: "Coffee Chill Out",
    artist: "Roman Belov",
    url: "http://localhost:3001/coffee-chill-out_romanbelov.mp3"
  },
  {
    title: "Dont Stop Me (Abstract Furure Bass)",
    artist: "AlexiAction",
    url: "http://localhost:3001/dont-stop-me-abstract-future-bass_alexi-action.mp3"
  },
  {
    title: "Embrace",
    artist: "ItsWatR",
    url: "http://localhost:3001/embrace_itswatr.mp3"
  },
  {
    title: "Empty Mind",
    artist: "Lofi_hour",
    url: "http://localhost:3001/empty-mind_lofi-hour.mp3"
  },
  {
    title: "Good Night",
    artist: "FASSounds",
    url: "http://localhost:3001/good-night_fassounds.mp3"
  },
  {
    title: "Lofi Chill Medium Version",
    artist: "Bo Dleasons",
    url: "http://localhost:3001/lofi-chill-medium-version_bo-dleasons.mp3"
  },
  {
    title: "lofi-study_fassounds.mp3",
    artist: "FASSounds",
    url: "http://localhost:3001/lofi-study_fassounds.mp3"
  },
  {
    title: "Lost Ambient Lofi 60s",
    artist: "Lesfm",
    url: "http://localhost:3001/lost-ambient-lofi-60s_lesfm.mp3"
  },
  {
    title: "Rain and Nostalgia (60s Lofi)",
    artist: "Lesfm",
    url: "http://localhost:3001/rain-and-nostalgia-version-60s_lesfm.mp3"
  },
  {
    title: "Spirit Blossom",
    artist: "Roman Belov",
    url: "http://localhost:3001/spirit-blossom_roman-belov.mp3"
  },
  {
    title: "Storm Clouds",
    artist: "Purple Cat",
    url: "http://localhost:3001/storm-clouds_purpple-cat.mp3"
  },
  {
    title: "Street Food",
    artist: "FASSounds",
    url: "http://localhost:3001/street-food_fassounds.mp3"
  },
  {
    title: "Sunset Vibes (Lo-Fi/Chillhop)",
    artist: "23843807",
    url: "http://localhost:3001/sunset-vibes-lo-fichillhop_coma-media.mp3"
  },
  {
    title: "The Weekend",
    artist: "Chilmore",
    url: "http://localhost:3001/the-weekend_chillmore.mp3"
  },
  {
    title: "Tokyo Cafe",
    artist: "TVARI",
    url: "http://localhost:3001/tvari-tokyo-cafe_tvari.mp3"
  },
  {
    title: "Watr Fluid",
    artist: "ItsWatR",
    url: "http://localhost:3001/watr-fluid_itswatr.mp3"
  },
];

export const HALFTONESTEPS = [
  [0, 1, 2, 3, 4, 5, 6, -5, -4, -3, -2, -1, 0], //from c to c, from c to cis, from c to d, ...
  [-1, 0, 1, 2, 3, 4, 5, 6, -5, -4, -3, -2, -1], //from cis to c, from cis to cis, from cis to d, ...,
  [-2, -1, 0, 1, 2, 3, 4, 5, 6, -5, -4, -3, -2],
  [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, -5, -4, -3],
  [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, -5, -4],
  [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, -5],
  [6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
  [5, 6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
  [4, 5, 6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4],
  [3, 4, 5, 6, -5, -4, -3, -2, -1, 0, 1, 2, 3],
  [2, 3, 4, 5, 6, -5, -4, -3, -2, -1, 0, 1, 2],
  [1, 2, 3, 4, 5, 5, -5, -4, -3, -2, -1, 0, 1],
  [0, 1, 2, 3, 4, 5, 6, -5, -4, -3, -2, -1, 0],
]