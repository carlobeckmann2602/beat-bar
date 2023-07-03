//const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();

// get the audio element
const audioElement = document.querySelector("audio");

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);
const audio_filter = audioContext.createBiquadFilter();
//audio_filter.type = 'allpass';
const gain_filter = audioContext.createGain()
track.connect(audio_filter)
audio_filter.connect(gain_filter)
gain_filter.connect(audioContext.destination);

// Select our play button
const playButton = document.querySelector("button");

const playbackrateInput = document.getElementById("playbackrate")
const defaultPlaybackrate = 87;

const gainInput = document.getElementById("gain")

const keyInput = document.getElementById("key")



playButton.addEventListener(
  "click",
  () => {
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume().then((r) => console.log("r: ", r));
    }

    // Play or pause track depending on state
    if (playButton.dataset.playing === "false") {

      let playbackrate = playbackrateInput.value / defaultPlaybackrate
      audioElement.playbackRate = playbackrate;
      audioElement.preservesPitch = true;

      audio_filter.detune.value = (keyInput.value * 100)

      console.log("audio_filter: ", audio_filter)

      gain_filter.gain.setValueAtTime(gainInput.value, audioContext.currentTime)


      audioElement.play().then((r) => console.log("r: ", r));

      playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
      audioElement.pause();
      playButton.dataset.playing = "false";
    }
  },
  false
);

audioElement.addEventListener(
  "ended",
  () => {
    playButton.dataset.playing = "false";
  },
  false
);
