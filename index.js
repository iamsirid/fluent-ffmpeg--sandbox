let ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const os = require('os');

console.log("it's running");

const promisifyCommand = command =>
  new Promise((resolve, reject) =>
    command
      .on('end', resolve)
      .on('error', reject)
      .run()
  );

const checkVideoMetadata = () =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(`${os.tmpdir()}/temp_vid`, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);

(async () => {
  const { width, height } = (await checkVideoMetadata()).streams[0];

  console.log(`video resolution is ${width} x ${height}`);

  await promisifyCommand(
    ffmpeg(`${os.tmpdir()}/temp_vid`)
      .format('mp4')
      .size('?x240')
      .save(`./temp_vid--240p.mp4`)
  );
  console.log('240p out');

  if (height >= 480) {
    await promisifyCommand(
      ffmpeg(`${os.tmpdir()}/temp_vid`)
        .format('mp4')
        .size('?x480')
        .save(`./temp_vid--480p.mp4`)
    );
    console.log('480p out');
  }
  if (height >= 720) {
    await promisifyCommand(
      ffmpeg(`${os.tmpdir()}/temp_vid`)
        .format('mp4')
        .size('?x720')
        .save(`./temp_vid--720p.mp4`)
    );
    console.log('720p out');
  }

  if (height >= 1080) {
    await promisifyCommand(
      ffmpeg(`${os.tmpdir()}/temp_vid`)
        .format('mp4')
        .size('?x1080')
        .save(`./temp_vid--1080p.mp4`)
    );
    console.log('1080p out');
  }
})();
