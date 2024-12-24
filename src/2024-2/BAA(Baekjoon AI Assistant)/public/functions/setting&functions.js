export const defaultsettingDict = { // 기본세팅
  fontsize: "14",
  adremove: true,
  AiFBuse: true,
  timer: false,
  stOF: true
};

export const server_ip="https://assist.n-e.kr";

//가독성 향상함수  
export function MakeReadEasy(something, type){
  const div = document.querySelector(something);
  const divtext = div.textContent;
  // 기존 내용 지우기
  div.innerHTML = ''; // innerHTML로 DOM 초기화
  // 코드 블록 파싱
  if(type == 'WS'){
    if(divtext.split("```").length > 0) {
      const txt = divtext.split("```");
      const code = document.createElement('code');
      code.textContent = txt[1];
      const othertxt = txt[0] + txt[2];
      const txtpart = document.createElement('div');
      txtpart.innerText = othertxt;
      div.appendChild(code); 
      div.appendChild(txtpart);
      document.querySelectorAll('code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }else{
      div.innerHTML = "오류가 발생하였습니다. f12를 눌러 콘솔을 확인해주세요.";
      console.log(divtext);
    }
  }else {
    const codepart = divtext.split('```');
  
    for (var i=0;i< codepart.length; i++){
      if(codepart[i] && i%2 == 1){

        const code = document.createElement('code');
        code.textContent = codepart[i].trim();
      
        div.appendChild(code); 
        document.querySelectorAll('code').forEach((block) => {
          hljs.highlightElement(block);
        });
      }
      else if(codepart[i] && i%2 == 0){
        // 기존 텍스트를 문장 단위로 나누기
        const sentencelist = codepart[i].trim().split('.');
        // 문장을 줄바꿈 처리하며 추가
        sentencelist.forEach((sentence) => {
          if (sentence.trim()) { // 빈 문장 제외
            const p = document.createElement('p');
            p.textContent = sentence.trim() + '.';
            div.appendChild(p);
          }
        });
      }
    }
  }
  
};

//사이드패널용 알림메세지
export function fademsg(text){
  toggleButton.click(); // 토글버튼을 접는다.
  const fademsg = document.getElementById("feedbackmsg");
  fademsg.innerText = text;
  fademsg.classList.add("show"); // 메시지 표시
  setTimeout(() => {
      fademsg.classList.remove("show"); // 일정 시간 후 숨기기
  }, 3000); // 3초 후 사라짐        
};

export function createtoggleButton(isMenuOpen,submenu1,submenu2,isOEoppend){
  const toggleButton = document.getElementById('toggleButton');
  const initimg = toggleButton.querySelector('img').src;
  toggleButton.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      if(isMenuOpen == true){
          toggleButton.querySelector('img').src = "https://www.svgrepo.com/show/486227/down-arrow-backup-2.svg";
      }else{
          toggleButton.querySelector('img').src = initimg;
      }
      submenu1.style.transform = isMenuOpen ? 'scaleY(1)' : 'scaleY(0)';
      submenu2.style.transform = isMenuOpen ? 'scaleY(1)' : 'scaleY(0)';
      if(document.getElementById('UmsgDiv')){
        isMenuOpen = false;
        document.querySelector('.OtherError').click();
        submenu1.style.transform = 'scaleY(0)';
        isOEoppend = false;
      }
  

  });
}

//답변에 오류가 있을 경우 모델을 4o로 바꿔서 응답을 재생성함 
export function AnswerError(where){
  const AnswerError = document.querySelector('.AnswerError');
  AnswerError.addEventListener('click', () => {
    document.getElementById("loading").classList.remove("hidden"); 
    // GPT모델 4o로 전환해서 응답을 출력하라는 메세지를 서버에 전송
    chrome.storage.sync.get(['problemNum','language'], function(output){
        const data = {
            req_type: `AnswerError`,
            language: `${output.language}`, // 사용자 언어 설정 값
            problem: `${output.problemNum}`, // 문제 번호
        };
        fetch(server_ip, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json' // JSON 형식으로 전송
            },
            body: JSON.stringify(data) // 데이터를 JSON으로 변환하여 전송
        })
        .then(response => response.json()) // 응답을 json형식으로 변환 
        .then(data => {
 
            document.getElementById("output").textContent = data.output; // 현재 문서에 표시
            MakeReadEasy('#output',where);
            fademsg("응답이 다시 생성 되었습니다.");
            document.getElementById("loading").classList.add("hidden"); 
        })
        .catch((error) => { // 오류 발생 시 처리
            console.error('Error:', error); // 오류 로그 출력
            fademsg("서버로부터 응답이 없습니다.");
        });
    });
      // 만약 4o가 적용된 응답이라면.. 피드백이 반영되었습니다. 라는 메세지를 사용자에게 출력
  
  });
}

export function OtherError(isMenuOpen,submenu1,submenu2,isOEoppend){
    
  const OtherError = document.querySelector('.OtherError');
  OtherError.addEventListener('click', () => {
    
    if(isOEoppend == false){
        const usermsgdiv = document.createElement('div');
        usermsgdiv.id = 'UmsgDiv';
        const usermsg = document.createElement('textarea');
        usermsg.id = 'usermsg';
        const sendbtn = document.createElement('button');
        sendbtn.id = 'Send';

        const sendbtnimg = document.createElement('img');
        sendbtnimg.src = '../Images/SendBtn.svg';
        sendbtn.append(sendbtnimg);
        usermsgdiv.append(usermsg);
        usermsgdiv.append(sendbtn);
        sendbtn.onclick = sendmsg;
        submenu1.style.transform = 'scaleY(0)';
        submenu2.append(usermsgdiv);
        isOEoppend = true;
        isMenuOpen = false;
    }else{
        submenu1.style.transform = 'scaleY(1)';
        isOEoppend = false;
        const usermsgdiv = document.getElementById('UmsgDiv');
        submenu2.removeChild(usermsgdiv);
        // 지우기
    }
    return isOEoppend;
    
  });
}

export function sendmsg(){
  chrome.storage.sync.get(['problemNum','language'],async function(output){
      const data = {
          req_type: `OtherError`,
          language: `${output.language}`, // 사용자 언어 설정 값
          problem: `${output.problemNum}`, // 문제 번호
          textElement: `${document.getElementById("usermsg").value.trim()}` // 사용자 입력 텍스트
      };
      fetch(server_ip, {
          method: 'POST',
          headers: {
              'Content-type': 'application/json' // JSON 형식으로 전송
          },
          body: JSON.stringify(data) // 데이터를 JSON으로 변환하여 전송
      })
      .then(response => response.json()) // 응답을 json형식으로 변환 
      .then(data => {
          fademsg("저장되었습니다.");
      })
      .catch((error) => { // 오류 발생 시 처리
          console.error('Error:', error); // 오류 로그 출력
          fademsg("서버로부터 응답이 없습니다.");
      });
  });
}
