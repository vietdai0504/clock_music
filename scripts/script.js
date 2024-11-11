// Clock
const updateTime = () => {
  const time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  let ampm = hours >= 12 ? "PM" : "AM";
  let otherampm = hours >= 12 ? "AM" : "PM";

  hours = hours % 12 || 12;
  hours = addTrailingZero(hours);
  minutes = addTrailingZero(minutes);
  seconds = addTrailingZero(seconds);

  $("#hour").html(hours);
  $("#min").html(minutes);
  $("#sec").html(seconds);
  $("#ampm").html(ampm);
  $("#other-ampm").html(otherampm);
};

updateTime();
setInterval(updateTime, 1000);

$("#stopwatch-btn").click(function () {
  $(".clock, .timer").slideUp();
  $(".stopwatch").slideDown();
  $(".type").html("Stopwatch");
  $(".music-player").show(); // Đảm bảo trình phát nhạc luôn hiển thị
});

$("#timer-btn").click(function () {
  $(".clock, .stopwatch").slideUp();
  $(".timer").slideDown();
  $(".type").html("Timer");
  $(".music-player").show(); // Đảm bảo trình phát nhạc luôn hiển thị
});

$(".back-btn").click(function () {
  $(".stopwatch, .timer").slideUp();
  $(".clock").slideDown();
  $(".type").html("Clock");
  $(".music-player").show(); // Đảm bảo trình phát nhạc luôn hiển thị
});

let stopwatchHours = 0,
  stopwatchMinutes = 0,
  stopwatchSeconds = 0,
  stopwatchMiliSeconds = 0,
  stopwatchRunning = false,
  laps = 0,
  stopwatchInterval;

function stopwatch() {
  stopwatchMiliSeconds++;
  if (stopwatchMiliSeconds === 100) {
    stopwatchMiliSeconds = 0;
    stopwatchSeconds++;
  }
  if (stopwatchSeconds === 60) {
    stopwatchSeconds = 0;
    stopwatchMinutes++;
  }
  if (stopwatchMinutes === 60) {
    stopwatchMinutes = 0;
    stopwatchHours++;
  }

  $("#stopwatch-hour").html(addTrailingZero(stopwatchHours));
  $("#stopwatch-min").html(addTrailingZero(stopwatchMinutes));
  $("#stopwatch-sec").html(addTrailingZero(stopwatchSeconds));
  $("#stopwatch-ms").html(addTrailingZero(stopwatchMiliSeconds));
}

function startStopwatch() {
  if (!stopwatchRunning) {
    stopwatchInterval = setInterval(stopwatch, 10);
    stopwatchRunning = true;
  }
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchRunning = false;
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchRunning = false;
  stopwatchHours = 0;
  stopwatchMinutes = 0;
  stopwatchSeconds = 0;
  stopwatchMiliSeconds = 0;
  laps = 0;
  $("#stopwatch-hour").html("00");
  $("#stopwatch-min").html("00");
  $("#stopwatch-sec").html("00");
  $("#stopwatch-ms").html("00");
}

$(".start-stopwatch").click(function () {
  startStopwatch();
  $(".start-stopwatch").hide();
  $(".lap-stopwatch").show();
});

$(".lap-stopwatch").click(function () {
  laps++;
  $(".lap").removeClass("active");
  $(".laps").prepend(
    ` <div class="lap active">
      <p>Lap ${laps}</p>
      <p>
        ${addTrailingZero(stopwatchHours)} : ${addTrailingZero(
      stopwatchMinutes
    )} : ${addTrailingZero(stopwatchSeconds)} : ${addTrailingZero(
      stopwatchMiliSeconds
    )}
      </p>
    </div>`
  );
});

$(".reset-stopwatch").click(function () {
  resetStopwatch();
  $(".start-stopwatch").show();
  $(".lap-stopwatch").hide();
  $(".laps").html("");
});

function addTrailingZero(number) {
  return number < 10 ? "0" + number : number;
}

let time = 0,
  timerHours = 0,
  timerMinutes = 0,
  timerSeconds = 0,
  timerMiliseconds = 0,
  timerRunning = false,
  timerInterval;

function getTime() {
  time = prompt("Enter time in minutes");
  time = time * 60;
  setTime();
}
function setTime() {
  timerHours = Math.floor(time / 3600);
  timerMinutes = Math.floor((time % 3600) / 60);
  timerSeconds = Math.floor(time % 60);
  timerMiliseconds = 0;

  $("#timer-hour").html(addTrailingZero(timerHours));
  $("#timer-min").html(addTrailingZero(timerMinutes));
  $("#timer-sec").html(addTrailingZero(timerSeconds));
  $("#timer-ms").html(addTrailingZero(timerMiliseconds));
}

function timer() {
  timerMiliseconds--;
  if (timerMiliseconds === -1) {
    timerMiliseconds = 99;
    timerSeconds--;
  }
  if (timerSeconds === -1) {
    timerSeconds = 59;
    timerMinutes--;
  }
  if (timerMinutes === -1) {
    timerMinutes = 59;
    timerHours--;
  }

  $("#timer-hour").html(addTrailingZero(timerHours));
  $("#timer-min").html(addTrailingZero(timerMinutes));
  $("#timer-sec").html(addTrailingZero(timerSeconds));
  $("#timer-ms").html(addTrailingZero(timerMiliseconds));

  timeUp();
}

function startTimer() {
  if (timerHours === 0 && timerMinutes === 0 && timerSeconds === 0) {
    getTime();
  } else {
    timerInterval = setInterval(timer, 10);
    timerRunning = true;
    $(".start-timer").hide();
    $(".stop-timer").show();
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  $(".start-timer").show();
  $(".stop-timer").hide();
}

function resetTimer() {
  stopTimer();
  time = 0;
  setTime();
}

function timeUp() {
  if (
    timerHours === 0 &&
    timerMinutes === 0 &&
    timerSeconds === 0 &&
    timerMiliseconds === 0
  ) {
    stopTimer();
    alert("Time's up!");

    setTime();
  }
}

$(".start-timer").click(startTimer);

$(".stop-timer").click(stopTimer);

$(".reset-timer").click(function () {
  resetTimer();
  if (!timerRunning) {
    $(".start-timer").show();
    $(".stop-timer").hide();
  }
});

$(document).ready(function() {
  const audioPlayer = document.getElementById('audioPlayer');
  const songSelect = document.getElementById('songSelect');
  const defaultMusic = "audio/audio.mp3";

  audioPlayer.volume = 0.2;
  audioPlayer.src = defaultMusic;

  // Load danh sách bài hát từ songList.js
  $.getScript('scripts/songList.js', () => {
      // Sau khi songList.js được load
      songList.forEach(song => {
          const option = document.createElement('option');
          option.value = song.file;
          option.text = song.title;
          songSelect.appendChild(option);
      });
  });

  songSelect.addEventListener('change', () => {
      const selectedSong = songSelect.value;
      audioPlayer.src = selectedSong;
      audioPlayer.play();
  });

  // Khi bài hát kết thúc, phát bài tiếp theo
  audioPlayer.addEventListener('ended', () => {
      let nextIndex = songSelect.selectedIndex + 1;
      if (nextIndex >= songSelect.options.length) {
          nextIndex = 0; // Vòng lại bài đầu tiên nếu đã hết danh sách
      }
      songSelect.selectedIndex = nextIndex;
      audioPlayer.src = songSelect.value;
      audioPlayer.play();
  });
});



// Phần code còn lại cho chức năng đồng hồ, đồng hồ bấm giờ, hẹn giờ... 

// Các phần code khác của script.js

// // Web Audio API for Visualizer
// const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// const analyser = audioContext.createAnalyser();
// const source = audioContext.createMediaElementSource(audioPlayer);
// source.connect(analyser);
// analyser.connect(audioContext.destination);

// analyser.fftSize = 256;

// const bufferLength = analyser.frequencyBinCount;
// const dataArray = new Uint8Array(bufferLength);
// const ctx = canvas.getContext('2d');

// const screenWidth = containerDiv.offsetWidth;

// console.log(screenWidth)

// canvas.width = screenWidth;

// function draw() {
//   requestAnimationFrame(draw);

//   analyser.getByteFrequencyData(dataArray);
//   ctx.fillStyle = '#6994c5'
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   const barWidth = (canvas.width / bufferLength) * 2.5;
//   let barHeight;
//   let x = 0;

//   for(let i = 0; i < bufferLength; i++) {
//     barHeight = dataArray[i] / 2;

//     canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',150,200)';
//     canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

//     x += barWidth + 1;
//   }
// }

// draw();