// 세션 스토리지에 저장
function saveElapsedTime(elapsedTime) {
    sessionStorage.setItem('stopwatchElapsedTime', elapsedTime);
}
  
// 세션 스토리지에서 복원
function loadElapsedTime() {
const savedTime = sessionStorage.getItem('stopwatchElapsedTime');
return savedTime ? parseInt(savedTime, 10) : 0; // 저장된 시간(ms)을 반환
}
  
// 시간 형식 변환
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// 시간 표시 업데이트
function updateDisplay() {
  document.querySelector('.stopwatch-display').textContent = formatTime(elapsedTime);
}

// 스톱워치 시작
function startStopwatch() {
  if (timerInterval) return; // 이미 실행 중이면 중단
  const startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
    saveElapsedTime(elapsedTime); // 1초마다 세션 스토리지에 저장
  }, 1000); // 1초마다 화면 업데이트
}

// 스톱워치 멈춤
function stopStopwatch() {
  clearInterval(timerInterval);
  timerInterval = null;

}

// 스톱워치 초기화
function resetStopwatch() {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime = 0;
  updateDisplay();
  sessionStorage.removeItem('stopwatchElapsedTime'); // 스토리지에서 삭제
}

let elapsedTime = loadElapsedTime(); // 시작 시 저장된 상태 복원
let timerInterval = null;
if(elapsedTime != 0) startStopwatch();

// UI 생성 (기존 코드와 동일)
const stopwatchUI = document.createElement('div');
stopwatchUI.style.position = 'absolute';
stopwatchUI.style.top = '10px';
stopwatchUI.style.right = '10px';
stopwatchUI.style.width = '161px';
stopwatchUI.style.height = '100px';
stopwatchUI.style.backgroundColor = '#000'; 
stopwatchUI.style.border = '0px solid #333';
stopwatchUI.style.borderRadius = '10px';
stopwatchUI.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
stopwatchUI.style.paddingBottom = '10px';
stopwatchUI.style.textAlign = 'center';
stopwatchUI.style.color = '#0f0'; 
stopwatchUI.style.zIndex = '1002';
document.body.appendChild(stopwatchUI);


stopwatchUI.innerHTML = `
  <div class="canmovearea" style="
      background-color: gray; 
      height: 16px; 
      cursor: move; 
    "> 
  </div>
  <div class="stopwatch-display" style="
      font-family: 'Courier New', Courier, monospace; 
      font-size: 2rem; 
      color: #0f0; 
      text-shadow: 0 0 5px #0f0, 0 0 10px #0f0;
    ">
    00:00:00
  </div>
  <div style="display: flex; gap: 5px; width: 100%; height: 40px;">
    <button id="start" style="
        font-size: 1rem; 
        flex-grow: 1; 
        background-color: #333; 
        color: #fff; 
        border: none; 
        border-radius: 5px; 
        padding: 10px;
        cursor: pointer;
      ">
      Start
    </button>
    <button id="stop" style="
        font-size: 1rem; 
        flex-grow: 1; 
        background-color: #333; 
        color: #fff; 
        border: none; 
        border-radius: 5px; 
        padding: 10px;
        cursor: pointer;
      ">
      Stop
    </button>
    <button id="reset" style="
        font-size: 1rem; 
        flex-grow: 1; 
        background-color: #333; 
        color: #fff; 
        border: none; 
        border-radius: 5px; 
        padding: 10px;
        cursor: pointer;
      ">
      Reset
    </button>
  </div>
`;

let isDragging = false;
let offsetX, offsetY;

// 드래그 대상: stopwatchUI 전체
const bar = document.querySelector('.canmovearea');
const Timecontainer = stopwatchUI;

// 드래그 시작 이벤트
bar.addEventListener("mousedown", (e) => {
  isDragging = true;
  const rect = Timecontainer.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  bar.style.backgroundColor = "#e0e0e0";
  document.body.style.userSelect = "none"; // 드래그 중 텍스트 선택 방지
});

// 드래그 중 이벤트
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // 화면 범위 안으로 제한
    x = Math.max(0, Math.min(window.innerWidth - Timecontainer.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - Timecontainer.offsetHeight, y));

    // 위치 업데이트
    Timecontainer.style.left = `${x}px`;
    Timecontainer.style.top = `${y}px`;
  }
});

// 드래그 종료 이벤트
document.addEventListener("mouseup", () => {
  isDragging = false;
  bar.style.backgroundColor = "gray";
  document.body.style.userSelect = "auto"; // 드래그 종료 후 텍스트 선택 가능하게 복원
});


document.getElementById('start').addEventListener('click', startStopwatch);
document.getElementById('stop').addEventListener('click', stopStopwatch);
document.getElementById('reset').addEventListener('click', resetStopwatch);

// 초기 상태 표시
updateDisplay();
