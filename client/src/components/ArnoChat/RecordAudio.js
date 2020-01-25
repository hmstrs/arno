window.MediaRecorder = require('audio-recorder-polyfill');

const makeBase64 = async audioBlob =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onload = async () => {
      const base64AudioMessage = reader.result.split(',')[1];
      resolve(base64AudioMessage);
    };
  });

const recordAudio = () =>
  new Promise(async (resolve, reject) => {
    if (MediaRecorder.notSupported) {
      alert('not support MediaRecorder but we will try');
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      let audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', event =>
        audioChunks.push(event.data)
      );

      const start = () => {
        if (mediaRecorder.state === 'inactive') {
          audioChunks = [];
          mediaRecorder.start();
        }
      };

      const stop = () =>
        new Promise(resolve => {
          mediaRecorder.addEventListener('stop', async () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            const base64 = await makeBase64(audioBlob);
            const play = () => audio.play();
            resolve({ audioBlob, base64, play });
          });

          mediaRecorder.stop();
        });

      resolve({ start, stop });
    } catch (err) {
      console.log(err);
      alert(
        'Вы не предоставили доступ на запись микрофона, Дайте права на запись в настройках сайта'
      );
    }
  });

export default recordAudio;
