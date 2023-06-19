const Meyda = require("meyda");
const fs = require("fs");
const path = require("path");

async function essentiaTest(essentia) {
  //const { AudioContext } = require('web-audio-api')
  const audioCtx = new AudioContext();

  let audioURL = "https://freesound.org/data/previews/328/328857_230356-lq.mp3";

  // decode audio data
  const audioBuffer = await essentia.getAudioBufferFromURL(audioURL, audioCtx);

  // convert the JS float32 typed array into std::vector<float>
  const inputSignalVector = essentia.arrayToVector(
    audioBuffer.getChannelData(0)
  );

  /*

    // Computing ReplayGain from an input audio signal vector
    // The algorithm return float type
    // check https://essentia.upf.edu/reference/std_ReplayGain.html
    let outputRG = essentia.ReplayGain(inputSignalVector, // input
        44100); // sampleRate (parameter optional)


    console.log(outputRG.replayGain);

    // Running PitchYinProbabilistic algorithm on an input audio signal vector
    // check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html
    let outputPyYin = essentia.PitchYinProbabilistic(inputSignalVector, // input
        // parameters (optional)
        4096, // frameSize
        256, // hopSize
        0.1, // lowRMSThreshold
        'zero', // outputUnvoiced,
        false, // preciseTime
        44100); //sampleRate

    let pitches = essentia.vectorToArray(outputPyYin.pitch);
    let voicedProbabilities = essentia.vectorToArray(outputPyYin.voicedProbabilities);

    console.log(pitch);
    console.log(voicedProbabilities);

    outputPyYin.pitch.delete()
    outputPyYin.voicedProbabilities.delete()

    // CAUTION: only use the `shutdown` and `delete` methods below if you've finished your analysis and don't plan on re-using Essentia again in your program lifecycle.

    // call internal essentia::shutdown C++ method
    essentia.shutdown();
    // delete EssentiaJS instance, free JS memory
    essentia.delete();
    */
}

function essentiaTestTwo() {
  let Meyda = require("meyda");
  let essentia = require("essentia.js");
  let fs = require("fs");
  let path = require("path");
  let Benchmark = require("benchmark");

  const FRAME_SIZE = 2048;
  const HOP_SIZE = 1024;
  const audioFilePath = path.join(
    __dirname,
    "../",
    "./input/storm-clouds-purpple-cat.mp3"
  );

  var options = {};
  if (process.argv[2] !== undefined) {
    options = {
      minSamples: process.argv[2],
      initCount: 1,
      minTime: -Infinity,
      maxTime: -Infinity,
    };
  }

  fs.readFile(audioFilePath, (err, data) => {
    if (err) throw err;
    let audioBuffer = data;
    const suite = new Benchmark.Suite("Loundness");

    // add tests
    suite
      .add(
        "Meyda#Loundness",
        () => {
          for (let i = 0; i < audioBuffer.length / HOP_SIZE; i++) {
            Meyda.bufferSize = FRAME_SIZE;
            let frame = audioBuffer.slice(
              HOP_SIZE * i,
              HOP_SIZE * i + FRAME_SIZE
            );
            if (frame.length !== FRAME_SIZE) {
              frame = Buffer.concat([frame], FRAME_SIZE);
            }
            Meyda.extract(["loudness"], frame);
          }
        },
        options
      )
      .add(
        "Essentia#Loundness",
        () => {
          const frames = essentia.FrameGenerator(
            audioBuffer,
            FRAME_SIZE,
            HOP_SIZE
          );
          for (var i = 0; i < frames.size(); i++) {
            var frame_windowed = essentia.Windowing(
              frames.get(i),
              true,
              FRAME_SIZE
            );
            essentia.BarkBands(
              essentia.Spectrum(frame_windowed["frame"])["spectrum"],
              24
            );
          }
        },
        options
      )
      // add listeners
      .on("cycle", function (event) {
        console.log(String(event.target));
      })

      .on("complete", function () {
        // console.log(this);
        //console.log('Fastest is ' + this.filter('fastest').map('name'));
        console.log("this object: ", this);
        const resultsObj = {
          meyda: {
            mean: this[0].stats.mean,
            moe: this[0].stats.moe,
            rme: this[0].stats.rme,
            sem: this[0].stats.sem,
            deviation: this[0].stats.deviation,
            variance: this[0].stats.variance,
            "execution times": this[0].stats.sample,
            cycle: this[0].times.cycle,
            elapsed: this[0].times.elapsed,
            period: this[0].times.period,
            timeStamp: this[0].times.timeStamp,
            count: this[0].count,
            cycles: this[0].cycles,
            hz: this[0].hz,
          },
          essentia: {
            mean: this[1].stats.mean,
            moe: this[1].stats.moe,
            rme: this[1].stats.rme,
            sem: this[1].stats.sem,
            deviation: this[1].stats.deviation,
            variance: this[1].stats.variance,
            "execution times": this[1].stats.sample,
            cycle: this[1].times.cycle,
            elapsed: this[1].times.elapsed,
            period: this[1].times.period,
            timeStamp: this[1].times.timeStamp,
            count: this[1].count,
            cycles: this[1].cycles,
            hz: this[1].hz,
          },
        };

        var json = JSON.stringify(resultsObj);
        fs.writeFile("output/loudness.json", json, "utf8", function (err) {
          if (err) {
            console.log(
              "An error occured while writing Loudness JSON Object to File."
            );
            return console.log(err);
          }

          console.log("Loudness JSON file has been saved.");
        });
      })
      // run async
      .run({ async: true });
  });
}

function testThree() {
  let Meyda = require("meyda");
  let essentia = require("essentia.js");
  let fs = require("fs");
  let path = require("path");
  let Benchmark = require("benchmark");

  const FRAME_SIZE = 2048;
  const HOP_SIZE = 1024;
  const audioFilePath = path.join(
    __dirname,
    "..",
    "input",
    "storm-clouds-purpple-cat.mp3"
  );
  var options = {};
  if (process.argv[2] !== undefined) {
    options = {
      minSamples: process.argv[2],
      initCount: 1,
      minTime: -Infinity,
      maxTime: -Infinity,
    };
  }

  fs.readFile(audioFilePath, (err, data) => {
    if (err) throw err;
    let audioBuffer = data;
    const suite = new Benchmark.Suite("AmplitudeSpectrum");

    // add tests
    suite
      .add(
        "Meyda#AmplitudeSpectrum",
        () => {
          for (let i = 0; i < audioBuffer.length / HOP_SIZE; i++) {
            Meyda.bufferSize = FRAME_SIZE;
            let frame = audioBuffer.slice(
              HOP_SIZE * i,
              HOP_SIZE * i + FRAME_SIZE
            );

            if (frame.length !== FRAME_SIZE) {
              frame = Buffer.concat([frame], FRAME_SIZE);
            }
            Meyda.extract(["amplitudeSpectrum"], frame);
          }
        },
        options
      )
      .add(
        "Essentia#AmplitudeSpectrum",
        () => {
          for (let i = 0; i < audioBuffer.length / HOP_SIZE; i++) {
            let frame = audioBuffer.slice(
              HOP_SIZE * i,
              HOP_SIZE * i + FRAME_SIZE
            );
            const frame_windowed = essentia.Windowing(
              essentia.arrayToVector(frame),
              true,
              FRAME_SIZE
            );
            essentia.Spectrum(frame_windowed["frame"]);
          }
        },
        options
      )
      // add listeners
      .on("cycle", function (event) {
        console.log(String(event.target));
      })

      .on("complete", function () {
        //console.log(this);
        //console.log('Fastest is ' + this.filter('fastest').map('name'));
        console.log("this object: ", this);

        const resultsObj = {
          meyda: {
            mean: this[0].stats.mean,
            moe: this[0].stats.moe,
            rme: this[0].stats.rme,
            sem: this[0].stats.sem,
            deviation: this[0].stats.deviation,
            variance: this[0].stats.variance,
            "execution times": this[0].stats.sample,
            cycle: this[0].times.cycle,
            elapsed: this[0].times.elapsed,
            period: this[0].times.period,
            timeStamp: this[0].times.timeStamp,
            count: this[0].count,
            cycles: this[0].cycles,
            hz: this[0].hz,
          },
          essentia: {
            mean: this[1].stats.mean,
            moe: this[1].stats.moe,
            rme: this[1].stats.rme,
            sem: this[1].stats.sem,
            deviation: this[1].stats.deviation,
            variance: this[1].stats.variance,
            "execution times": this[1].stats.sample,
            cycle: this[1].times.cycle,
            elapsed: this[1].times.elapsed,
            period: this[1].times.period,
            timeStamp: this[1].times.timeStamp,
            count: this[1].count,
            cycles: this[1].cycles,
            hz: this[1].hz,
          },
        };

        var json = JSON.stringify(resultsObj);
        fs.writeFile(
          "output/amplitude_spectrum.json",
          json,
          "utf8",
          function (err) {
            if (err) {
              console.log(
                "An error occured while writing amplitudeSpectrum JSON Object to File."
              );
              return console.log(err);
            }
            console.log("Amplitude Spectrum JSON file has been saved.");
          }
        );
      })
      // run async
      .run({ async: true });
  });
}

function testFour() {
  let Meyda = require("meyda");
  let essentia = require("essentia.js");
  let fs = require("fs");
  let path = require("path");
  let Benchmark = require("benchmark");

  const FRAME_SIZE = 2048;
  const HOP_SIZE = 1024;
  const audioFilePath = path.join(
    __dirname,
    "../",
    "./input/storm-clouds-purpple-cat.mp3"
  );

  fs.readFile(audioFilePath, (err, data) => {
    if (err) throw err;
    let audioBuffer = data;

    for (let i = 0; i < audioBuffer.length / HOP_SIZE; i++) {
      Meyda.bufferSize = FRAME_SIZE;
      let frame = audioBuffer.slice(HOP_SIZE * i, HOP_SIZE * i + FRAME_SIZE);

      if (frame.length !== FRAME_SIZE) {
        frame = Buffer.concat([frame], FRAME_SIZE);
      }
      let res = Meyda.extract(["amplitudeSpectrum"], frame);
      console.log(res);
    }
  });
}

module.exports = {
  essentiaTest,
  essentiaTestTwo,
  testThree,
  testFour,
};

// find more at https://github.com/MTG/essentia.js-benchmarks/tree/master/node
// or in this thread: https://github.com/MTG/essentia.js/issues/44
