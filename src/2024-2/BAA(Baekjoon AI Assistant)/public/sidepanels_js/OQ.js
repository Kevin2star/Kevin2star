import { createtoggleButton, defaultsettingDict, MakeReadEasy, fademsg, AnswerError, OtherError, sendmsg, server_ip} from "../functions/setting&functions.js";

const textarea = document.getElementById("Text"); // 사용자 입력 텍스트 영역
const submitbtn = document.getElementById("Send"); // 제출 버튼
const chatbox = document.getElementById("chatbox"); // 채팅 박스

// 말풍선 생성 함수
function createBubble(message, type = 'sent', font = 14) {
    // 메시지 컨테이너 div 생성
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message'); // 기본 클래스 추가
    if (type === 'sent') {
        messageDiv.classList.add('sent');
    } else if (type === 'received') {
        messageDiv.classList.add('received'); 
    }

    // 말풍선 div 생성
    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('bubble'); // 말풍선 스타일 적용
    bubbleDiv.style.fontSize = `${font}px`;
    if (type === 'sent') {
        bubbleDiv.classList.add('sent'); 
    } else if (type === 'received') {
        bubbleDiv.classList.add('received'); 
    }

    bubbleDiv.textContent = message; // 말풍선에 메시지 텍스트 설정
    messageDiv.appendChild(bubbleDiv); // 메시지 컨테이너에 말풍선 추가
    chatbox.appendChild(messageDiv); // 채팅 박스에 메시지 컨테이너 추가
    MakeReadEasy('.bubble',"OQ");
};

async function panelOpened(){

    await chrome.storage.sync.get(['userName','setting'], async function(output) {
        const username = output.userName;
        let settingDict = {};
        if(!output.setting) settingDict = defaultsettingDict;
        else settingDict = output.setting;
        let font = settingDict.fontsize;

        // 서버로 전송할 데이터 설정
        const data = {
            req_type: `OQ`,
            userName: username
        };
        // 서버로 POST 요청 전송, 서버에선 DB를 확인하고 사용자가 DB에 없으면 생성하고,
        // 남은 질문횟수를 응답함
        await fetch(server_ip, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json' // JSON 형식으로 전송
            },
            body: JSON.stringify(data) // 데이터를 JSON으로 변환하여 전송
        })
        .then(response => response.json()) // 서버 응답 JSON으로 변환
        .then(data => {
            if ( data.output === '0'){
                createBubble('질문횟수가 소진되었습니다.', 'received',font);
            }
        })
        .catch((error) => { // 오류 발생 시 처리
            console.error('Error'); // 오류 로그 출력
            createBubble('서버로부터 응답이 없습니다.', 'received',font); // 오류 메시지 표시
            
        });
        document.getElementById('CSS').href = "../css/SP_style.css"; // CSS 원상 복구
        document.getElementById("loading").classList.add("hidden");  // 로딩 화면 숨기기
    });

    // 사용자 입력 이벤트 리스너
    textarea.addEventListener("input", function () {
        this.style.height = "auto"; // 높이 초기화
        const scrollHeight = this.scrollHeight; // 스크롤 높이 계산

        // 사용자 입력의 최대 높이 제한
        const maxHeight = 300;

        // 현재 높이가 최대 높이보다 작거나 같을 때만 크기 조정
        if (scrollHeight <= maxHeight) {
            this.style.height = scrollHeight + "px"; // 현재 높이에 맞게 조정
        } else {
            this.style.height = maxHeight + "px"; // 최대 높이로 제한
        }
    });

    // 제출 버튼 클릭 시 수행할 작업
    submitbtn.addEventListener("click", async () => {

        document.getElementById('CSS').href = "../css/SP_style.css"; // 로딩 화면 표시를 위한 CSS 적용
        document.getElementById("loading").classList.remove("hidden"); // 로딩 표시 활성화

        // Chrome 스토리지에서 문제 번호 가져오기 (비동기 함수 사용)
        chrome.storage.sync.get(['problemNum','language','userName','setting'], async function(output) {
            let settingDict = {};
            if(!output.setting) settingDict = defaultsettingDict;
            else settingDict = output.setting;
            let font = settingDict.fontsize;
            // 서버로 전송할 데이터 설정
            const data = {
                req_type: `OQ`,
                language: `${output.language}`, // 사용자 언어 설정 값
                problem: `${output.problemNum}`, // 문제 번호
                textElement: `${document.getElementById("Text").value.trim()}`, // 사용자 입력 텍스트
                Id: output.userName
            };

            // 서버로 POST 요청 전송
            await fetch(server_ip, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json' // JSON 형식으로 전송
                },
                body: JSON.stringify(data) // 데이터를 JSON으로 변환하여 전송
            })
            .then(response => response.json()) // 서버 응답 JSON으로 변환
            .then(data => {
                const textElement = document.getElementById("Text").value; // 사용자 텍스트 입력 내용 변수 저장
                const message = textElement.trim();
                if (message !== "") {
                    createBubble(message, 'sent',font);  // 사용자의 말풍선 생성
                    createBubble(data.output, 'received',font);  // 서버 응답을 수신된 말풍선으로 표시
                }
            })
            .catch((error) => { // 오류 발생 시 처리
                console.error('Error:', error); // 오류 로그 출력
                const textElement = document.getElementById("Text").value; // 사용자 텍스트 입력 내용 변수 저장
                const message = textElement.trim();
                if (message !== "") {
                    createBubble(message, 'sent',font);  // 사용자의 말풍선 생성
                    createBubble('서버로부터 응답이 없습니다.', 'received',font); // 오류 메시지 표시
                }
            });

            document.getElementById('CSS').href = "../css/SP_style.css"; // CSS 원상 복구
            document.getElementById("loading").classList.add("hidden");  // 로딩 화면 숨기기

            textarea.value = ""; // 사용자 입력 내용 초기화
            textarea.style.height = "auto"; // 사용자 입력 영역 초기화
        });
    });

};

panelOpened();

