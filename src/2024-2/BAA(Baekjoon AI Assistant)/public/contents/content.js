const server_ip = 'https://assist.n-e.kr';
const defaultsettingDict = { // 기본세팅
  fontsize: "14",
  adremove: true,
  AiFBuse: true,
  timer: false,
  stOF: true
};

// 모달 스크롤바 스타일 추가 함수
function addScrollbarStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    #myModal::-webkit-scrollbar {
      width: 8px; 
    }

    #myModal::-webkit-scrollbar-track {
      background: #f1f1f1; 
      border-radius: 10px;
    }

    #myModal::-webkit-scrollbar-thumb {
      background-color: #888; 
      border-radius: 10px; 
      border: 2px solid #fefefe; 
    }

    #myModal::-webkit-scrollbar-thumb:hover {
      background: #555; 
    }`;

  document.head.appendChild(style);
}
/* 
 * 
 *로딩 모달  
 * 
 */ 
function LoadingModal() { 
  const modalOverlay = document.createElement("div");
  const shadow = modalOverlay.attachShadow({ mode: "open" }); // Shadow DOM 사용
  const modalwidth = 250;
  const modalheight = 250;

  // 모달 요소 생성
  const modal = document.createElement("div");
  modal.style.width = `${modalwidth}px`; 
  modal.style.height = `${modalheight}px`;
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fefefe";
  modal.style.border = "2px solid #ccc";
  modal.style.borderRadius = "10px";
  modal.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
  modal.style.zIndex = "1001";
  
  // 로딩 애니메이션 요소 생성
  const loadingSpinner = document.createElement("div");
  loadingSpinner.style.width = "100px";
  loadingSpinner.style.height = "100px";
  loadingSpinner.style.border = "3px solid rgba(255, 255, 255, 0.3)";
  loadingSpinner.style.borderTop = "5px solid skyblue";  // 상단에만 색상 추가
  loadingSpinner.style.borderRadius = "50%";
  loadingSpinner.style.margin = "auto";
  loadingSpinner.style.position = "relative";
  loadingSpinner.style.top = "50%";
  loadingSpinner.style.transform = "translateY(-50%)";

  // 로딩 애니메이션 회전
  let rotation = 0;
  const spinAnimation = setInterval(() => {
    rotation += 10;
    loadingSpinner.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
  }, 16);

  // 스타일 격리
  const style = document.createElement("style");
  style.textContent = `
    div {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }`;
  
  shadow.appendChild(style); 
  shadow.appendChild(modal);
  modal.appendChild(loadingSpinner);
  document.body.appendChild(modalOverlay);

  function closeLoadingModal() {
    clearInterval(spinAnimation);
    modalOverlay.remove();
  };

  return closeLoadingModal;
};


// 모달 생성
function createModal(GPTresponse) {
  addScrollbarStyles(); // 스크롤바 스타일 추가

  // 모달 배경 요소 생성
  const modalOverlay = document.createElement("div");
  const modalwidth = 500;
  const modalheight = 200;
  // 모달 요소 생성
  const modal = document.createElement("div");
  modal.style.position = "absolute";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.width = `${modalwidth}px`; 
  modal.style.height = `${modalheight}px`;
  modal.style.backgroundColor = "#fefefe";
  modal.style.border = "2px solid #ccc";
  modal.style.borderRadius = "10px";
  modal.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
  modal.style.padding = "20px";
  modal.style.cursor = "move";
  modal.style.maxHeight = "300px";
  modal.style.overflowY = "auto"; // 스크롤바 활성화
  modal.style.zIndex = "1001";
  modal.id = "myModal";

  document.body.appendChild(modal); // 모달을 body에 추가

  let isDragging = false;
  let offsetX, offsetY;

  // 모달 드래그 이벤트 핸들러
  modal.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - modal.offsetLeft;
    offsetY = e.clientY - modal.offsetTop;
    modal.style.backgroundColor = "#e0e0e0";
    document.body.style.userSelect = "none"; // 드래그 중 텍스트 선택 방지
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
      if(x >= window.innerWidth - modalwidth/2) x = window.innerWidth - modalwidth/2;
      if(x <=  modalwidth/2) x = modalwidth/2;
      if(y <= modalheight/2) y = modalheight/2;
      modal.style.left = `${x}px`;
      modal.style.top = `${y}px`;
      updateCloseButtonPosition(); // 드래그 중 위치 업데이트
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    modal.style.backgroundColor = "#fefefe";
    document.body.style.userSelect = "auto"; // 드래그 종료 후 텍스트 선택 가능하게 복원
  });

  // 모달 내용
  const modalContent = document.createElement("p");
  modalContent.innerText = GPTresponse;

  // 닫기 버튼 생성 및 위치 설정
  const closeButton = document.createElement("button");
  closeButton.textContent = "x";
  closeButton.style.position = "absolute"; // 모달 내부 위치로 설정
  closeButton.style.background = "transparent";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "18px";
  closeButton.style.cursor = "pointer";
  closeButton.style.color = "#888";
  closeButton.onclick = function () {
      document.body.removeChild(modalOverlay);
  };

  // 모달에 내용 추가
  modal.appendChild(modalContent);
  modal.appendChild(closeButton);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  // 닫기 버튼 위치 업데이트 함수
  function updateCloseButtonPosition() {
    closeButton.style.top = `${modal.scrollTop + 10}px`; // 모달 위에서 10px 아래
    closeButton.style.right = "10px"; // 모달 우측에서 10px 간격
  }

  // 스크롤 이벤트에 위치 업데이트 함수 연결
  modal.addEventListener("scroll", updateCloseButtonPosition);

  // 초기 닫기 버튼 위치 설정
  updateCloseButtonPosition();
};


/* 
 *
 *
 * 현재 페이지에 따라 콘텐트 내용 추가
 * 
 * 
 */

chrome.storage.sync.get(['setting'], function(output) {
  let settingDict = {};
  if(output.setting) settingDict = output.setting;
  else settingDict = defaultsettingDict;

  if(settingDict.adremove == true) {
    const Adremove = document.createElement('script');
    Adremove.src = chrome.runtime.getURL('functions/RemoveAds.js');
    document.head.appendChild(Adremove);
  }


  // 백그라운드에서 보내는 메세지 리스너
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if ( request.problem === "this is BOJ URL" ){  
      const username = document.querySelector(".username").innerText.trim(); // 사용자의 아이디 추출
      // 사용자아이디가 저장되어있지 않으면 사용자아이디를 크롬sync스토리지에 저장  
      chrome.storage.sync.set({ userName: username }); 
    }
    if(((request.problem === "this is problemURL" || request.submit === "this is submitURL") && !document.getElementById('Timer')) && settingDict.timer == true){

      const timer = document.createElement('script');
      timer.id = 'Timer';
      timer.src = chrome.runtime.getURL('functions/Timer.js');
      document.head.appendChild(timer);
    
    }
    if (request.problem === "this is problemURL") {  

      if(settingDict.stOF && !document.getElementById('stackOF') ){
        const stackOF = document.createElement('script');
        stackOF.id = 'stackOF';
        stackOF.src = chrome.runtime.getURL('functions/stackOF.js');
        document.head.appendChild(stackOF);
      }

      // 문제 메뉴바.
      const problem_menus = document.querySelector(".problem-menu");

      // 메뉴바의 첫 번째 자식으로부터 문제 번호 추출 (1000번 -> 1000 추출).
      const first_menu = problem_menus.firstElementChild;  //첫번째 요소 노드 반환
      const problem_number = first_menu.querySelector("a").innerText.split("번")[0].trim();  // 문제번호 추출

      // 백그라운드에 메시지를 보내 사이드 패널 열기. 행동과 문제번호를 보냄.
      // 개념설명 기능
      const IdeaHelp = () => {
        chrome.runtime.sendMessage({ action: 'IH_sidepanel_open', problemNumber: problem_number});
      };
      // 정답보기 기능
      const WantSolve = () => {
        chrome.runtime.sendMessage({ action: 'WS_sidepanel_open', problemNumber: problem_number});
      };
      // 추가질문 기능 
      const OtherQuestion = async() => {
        chrome.runtime.sendMessage({ action: 'OQ_sidepanel_open', problemNumber: problem_number });
      };

      const link1 = document.querySelector('a[href="#1"]');
      // 버튼 생성 및 기능 추가.
      if(!link1){ // 만약 link1이 존재하지 않으면 실행(중복생성방지)
      // 현재 페이지에 링크요소를 생성하고 추가하는 함수
        function CreateIH(){
          const IH_list_container = document.createElement("li");
          const IH = document.createElement("a");
          IH.setAttribute("href", "#1");
          IH.onclick = IdeaHelp;
          IH.innerText = "개념설명";

          IH_list_container.append(IH);
          problem_menus.append(IH_list_container);
        };
        function CreateWS(){
          const WS_list_container = document.createElement("li");
          const WS = document.createElement("a");
          WS.setAttribute("href", "#2");
          WS.onclick = WantSolve;
          WS.innerText = "정답보기";

          WS_list_container.append(WS);
          problem_menus.append(WS_list_container);
        };
        function CreateOQ(){
          const OQ_list_container = document.createElement("li");
          const OQ = document.createElement("a");
          OQ.setAttribute("href", "#3");
          OQ.onclick = OtherQuestion;
          OQ.innerText = "추가질문";

          OQ_list_container.append(OQ);
          problem_menus.append(OQ_list_container);
        };
        CreateIH();
        CreateWS();
        CreateOQ();
      }
      
      function saveProblem(){ // 제출화면에서 표시하기위해 문제를 DB에 저장
        // 문제의 텍스트, 이미지를 추출 후 변수에 저장
        const problem_id = document.getElementById('problem_description');
        let problem_text = problem_id.textContent; 
        
        const problem_input = document.getElementById('problem_input');
        const problem_input_text = problem_input.textContent;
        
        const problem_output = document.getElementById('problem_output');
        const problem_output_text = problem_output.textContent;

        let problem_img_src = 'none';
        if(problem_id.querySelector("img")){
          const problem_img = problem_id.querySelector("img") ;
          problem_img_src = problem_img.src;
        }

        problem_text = "문제:" + problem_text + "입력:"+problem_input_text + "출력:"+problem_output_text;

          const data ={
            req_type:`saveproblem`, 
            problem : `${problem_number}`, 
            savedtext : `${problem_text}`, 
            problemIMG : `${problem_img_src}`
          }
          //문제가져와서 to 서버
          fetch(server_ip ,{ //서버에 POST요청을 보내서 AI의 응답을 받아옴
              method: 'POST',
              // mode: 'no-cors', // CORS우회
              headers: {
                  // 'Content-type' : 'application/x-www-form-urlencoded'
                  'Content-type' : 'application/json'
              },
              body : JSON.stringify(data)
              // body:  `saveproblem, ${problem_number}, ${problem_text}, ${problem_img_src}`. 
            })
            .then(response => response.json()) // 응답을 json형식으로 변환 
            .then(data => {
            })
            .catch((error) => { 
                console.error('Error:', error);
            });  
      };
      setTimeout(saveProblem(),1000);
          
      // OQ창을 열면 사용자이름을 가져와서 서버에 보냄 -> 서버에서 DB데이터와 대조 후 처리
      // 사용자의 질문횟수가 소진된 경우, 
    }else if (request.submit === "this is submitURL") {  
      
      if(sessionStorage.getItem('pagepath') === "edit"){ // 현재 페이지가 수정버튼을 눌러서 들어온 제출화면인 경우
        const closeLoading = LoadingModal(); // 로딩모달창 표시
        chrome.storage.sync.get(['language'],async function(output){ 
          let problemNum = sessionStorage.getItem('problemNumber');
          let what_problem = sessionStorage.getItem('whatproblem');

          if (what_problem === "맞았습니다!!"){what_problem = "맞은 코드입니다. 코드에 개선할게 있다면 개선점을 출력하세요."} 
          // GPT에게 문제번호와 틀린이유, 사용자의 코드를 전달 후 응답 출력 
          const data = { 
            req_type:`Edit`,
            language: `${output.language}`,
            problem: `${problemNum}`,
            errortype: `${what_problem}`,
            usercode: `${sessionStorage.getItem('testtxt')}`
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
              closeLoading();
              const GPTresponse = data.output; // 현재 문서에 표시 
              createModal(GPTresponse);
          })
          .catch((error) => { 
              console.error('Error:', error);
              closeLoading(); // 로딩모달 제거
              const GPTresponse = `서버로부터 응답이 없습니다.`; 
              createModal(GPTresponse);
          });
      
      });

        sessionStorage.removeItem('pagepath');
      }


      // 사용자가 제출한거 가져와서 개선점/틀린곳 보여주기위한 제출내용 저장
      const submitbtn = document.getElementById('submit_button');

      submitbtn.addEventListener('click', () => {    
        //유저코드 저장
        const usercodeElement = document.querySelectorAll('[class=" CodeMirror-line "]'); 
        let usercodeSet = new Set(); // 중복을 방지하기 위해 Set으로 저장 
        usercodeElement.forEach(element => { // 각각의 요소들에서 text를 추출 후 Set에 저장
          usercodeSet.add(element.innerText);
        })

        const txtall = Array.from(usercodeSet).join('\n'); // 저장된 데이터를 배열로 변환
        sessionStorage.setItem('testtxt',txtall);
      });

      // 문제보기 기능

      const problem_menus = document.querySelector(".problem-menu");

      // 메뉴바의 첫 번째 자식으로부터 문제 번호 추출 (1000번 -> 1000 추출).
      const first_menu = problem_menus.firstElementChild;  //첫번째 요소 노드 반환
      const problem_number = first_menu.querySelector("a").innerText.split("번")[0].trim();  // 문제번호 추출
        async function Problem(){  // 문제보기 체크박스를 체크하면 일어날 일
          let PN = problem_number;
          // fetch를 사용한 GET 요청
          await fetch(server_ip + `/${PN}`) // 서버주소/1002
          .then((response) => {
            // 응답이 성공적인지 확인
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // JSON 데이터를 파싱
          })
          .then(data => {
            // 추가할 새로운 요소 생성
            const problem = document.createElement("div");
            var txtlist = data.output.split("$")
            let txt = "";
            for(var i = 0; i< txtlist.length; i = i+2){
              txt += txtlist[i];
            }
            var probtxt = txt.split("문제:")[1];
            var inputtxt = probtxt.split("입력:")[1];
            probtxt = probtxt.split("입력:")[0];
            var tmp = inputtxt;
            var outputtxt = tmp.split("출력:")[1];
            inputtxt = inputtxt.split("출력:")[0];
            problem.innerText += "문제\n" + probtxt + "\n\n입력\n" + inputtxt + "\n출력\n" + outputtxt;

            // 문제 틀 요소 생성
            const ProblemBorder = document.createElement("div"); 
            const ProblemIMG = document.createElement("img");
            ProblemBorder.className = "PB";
            ProblemBorder.id = "PB";

            // 스타일추가
            ProblemBorder.style.color = "black";        
            ProblemBorder.style.fontSize = "13px";      
            ProblemBorder.style.fontWeight = "bold";   

            ProblemBorder.style.borderBottom = "2px solid black";
            ProblemBorder.style.borderRight = "2px solid black";
            ProblemBorder.style.borderLeft = "2px solid black";
            ProblemBorder.style.borderTop = "2px solid black";

            ProblemBorder.style.paddingRight = "20px";
            ProblemBorder.style.paddingLeft = "20px";
            ProblemBorder.style.paddingTop = "10px";
            ProblemBorder.style.paddingBottom = "10px";

            // 원하는 위치의 부모 요소 선택 
            const ProblemPos = document.querySelector(".form-group .col-md-10");
            // 새로운 요소를 현재문서에 추가
            ProblemPos.appendChild(ProblemBorder);
            ProblemBorder.appendChild(ProblemIMG);
            ProblemBorder.appendChild(problem);
            // 추가할 이미지 
            if(data.image != "none"){ProblemIMG.src = data.image} // 받은 문제이미지가있으면 추가
          })
          .catch((error) => {
            // 에러 처리
            console.error('에러 발생:', error);
          });



        }

        // 문제보기체크박스 생성 
        let ProblemCBox = document.createElement("input"); 
        ProblemCBox.type = "checkbox";
        ProblemCBox.className = "ProblemCheckBox";
        // 문제보기 체크박스 레이블 생성
        const PCBLabel = document.createElement("label");
        PCBLabel.htmlFor = "ProblemCheckBoxLabel";
        PCBLabel.innerText = "문제보기";

        // 체크박스 스타일 설정
        ProblemCBox.style.appearance = "none";
        ProblemCBox.style.width = "15px";
        ProblemCBox.style.height = "15px";
        ProblemCBox.style.border = "2px solid gray"; // 테두리 설정
        ProblemCBox.style.outline = "none"; 
        ProblemCBox.style.cursor = "pointer"; // 포인터 커서
        PCBLabel.style.cursor = "pointer"; // 포인터 커서
        

        // 체크박스 클릭 시 함수 실행
        ProblemCBox.addEventListener("change", () => { // 체크박스의 상태가 바뀌었을때
          if (ProblemCBox.checked) { // 체크박스가 체크된 상태라면 
            ProblemCBox.style.backgroundColor = "skyblue"; // 체크된 상태의 배경 색상
            Problem(); // 문제 생성
          }else { // 체크박스가 체크되지 않은 상태라면 
            ProblemCBox.style.backgroundColor = ""; // 체크 해제 시 기본 배경으로 돌아감
            document.getElementById("PB").remove(); // 생성된 문제를 제거
          }
        });

        // 레이블을 클릭해도 체크박스가 체크되게 사용자 편의성 향상
        PCBLabel.addEventListener("click", () => {
          ProblemCBox.checked = !ProblemCBox.checked; // 체크 상태를 반전
          ProblemCBox.dispatchEvent(new Event("change")); // 상태가 바뀌었음을 알리기 위해 이벤트를 트리거
        });
        
        // 현재 문서에 문제보기 체크박스와 그 레이블 생성
        const Position = document.querySelector(".form-group .col-md-10");
        Position.appendChild(ProblemCBox);
        Position.appendChild(PCBLabel);

     
      
    }else if (request.Mysubmit === 'this is MysubmitURL'){ 
      if(settingDict.AiFBuse == true){ // 피드백설정이 켜져있으면 기능활성화
        const AiFB = document.createElement('script');
        AiFB.src = chrome.runtime.getURL('functions/AiFB.js');
        document.head.appendChild(AiFB);
      }
    }
  });
});