import { createtoggleButton, defaultsettingDict, MakeReadEasy, fademsg, AnswerError, OtherError, sendmsg, server_ip} from "../functions/setting&functions.js";

document.addEventListener('DOMContentLoaded', async() => {
    chrome.storage.sync.get(['problemNum','language','setting'],async function(output){
        if(output.language == undefined) {    //만약 사용자가 팝업을 열지않고 버튼을 먼저누르는 경우에 실행
            output.language = "Python";  //스토리지의 값을 바꾸는 것은 아님: 스토리지값은 undefined인 상태로 유저의 컴퓨터에서만"Python"임
            alert('팝업창을 열어 언어를 선택해주세요. 현재는 Python으로 설정되어 있습니다.');  //유저에게 현재 선택된언어는 파이썬이라고 알림 
        }

        let settingDict = {};
        if(!output.setting) settingDict = defaultsettingDict
        else settingDict = output.setting;
        // 서버에 POST 요청을 보내는 코드
        
        //서버에 보낼 data 생성. 요청위치, 사용자의 언어, 문제번호를 보냄 
        const data = { 
          req_type:`IH`,
          language: `${output.language}`,
          problem: `${output.problemNum}`
        };
        await fetch(server_ip ,{ //서버에 POST요청을 보내서 AI의 응답을 받아옴
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(data) // JSON형식으로 변환하여 data를 전송, 서버에선 이 메세지를 받아서 그에 맞게 처리함. 
        })
        .then(response => response.json()) // 응답을 json형식으로 변환 
        .then(data => {

            document.getElementById("output").textContent += data.output; // 현재 문서에 표시
            document.getElementById('output').style.fontSize = `${settingDict.fontsize}px`; //폰트크기설정 
        })
        .catch((error) => { 
            console.error('Error:', error);
            document.getElementById("output").textContent += 
            '서버로부터 응답이 없습니다.'; 
            document.getElementById('output').style.fontSize = `${settingDict.fontsize}px`; //폰트크기설정 
        });
    
        MakeReadEasy('#output','IH');
    
        document.getElementById("loading").classList.add("hidden");  // 로딩화면 숨기기
    
        // 개념설명, 정답보기에 사용자의 피드백을 받을 수 있는 기능 추가
    });
    

    const submenu1 = document.querySelector('.submenu1');
    const submenu2 = document.querySelector('.submenu2');
    let isMenuOpen = false;
    let isOEoppend = false;
    createtoggleButton(isMenuOpen,submenu1,submenu2,isOEoppend);
    AnswerError('IH');
    OtherError(isMenuOpen,submenu1,submenu2,isOEoppend);
    
})