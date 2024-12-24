function SolveCheck(){
  // 개선점
  if(document.querySelector(".result .result-text").innerText === "맞았습니다!!"){ // 방금 제출한 문제가 맞은 경우

    // 무슨오류인지 세션스토리지에 저장(Ai에게 전달예정)
    const what_problem = document.querySelector(".result .result-text").innerText
    sessionStorage.setItem('whatproblem',what_problem);

    // 개선점 버튼이 들어갈 위치 추출
    const better_pointspan = document.querySelector(".result").firstElementChild;
    const br = document.createElement("br"); // 줄바꿈

    // 버튼을 추가하고 버튼설정
    const better_point = document.createElement("button");
    better_point.innerText = "Ai의 개선안 보기";
    better_point.style.backgroundColor = "skyblue";
    better_point.style.color = "#FFFFFF";
    better_point.style.textDecorationLine = "none";
    better_point.style.border = "none";
    
    // 문제 번호 추출.
    const problem_menus = document.querySelector(".problem-menu");
    const first_menu = problem_menus.firstElementChild;  
    const problemNumber = first_menu.querySelector("a").innerText.split("번")[0].trim();  // 문제번호 추출
    sessionStorage.setItem('problemNumber',problemNumber);

    better_point.addEventListener('click', () => { // Ai에게 코드를 전달하고 페이지를 수정화면으로 이동, 개선점을 사용자에게 표시 (모달창)
      const pattern = /\/submit\/.*/;

      for (const aTag of document.querySelectorAll("td a")) {
        const hrefValue = aTag.getAttribute("href");
        if (pattern.test(hrefValue)) { // 정규표현식에 맞는 href값 탐색 
          window.location.href = hrefValue; // href 링크로 이동
          sessionStorage.setItem('pagepath',"edit"); // 수정 버튼을 눌러서 submit에 접근한 경우를 식별하기 위해 세션스토리지에 정보 추가 
          break; // 첫 번째 요소를 찾으면 반복문 종료
        }
      };
    });

    better_pointspan.appendChild(br);   // 줄바꿈
    better_pointspan.appendChild(better_point);
    const confettiContainer = document.createElement("div");
    confettiContainer.style.cssText = `
             position: fixed;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             z-index: 9999;
             pointer-events: none;
             `;
          
    // 폭죽 조각 생성 함수
    function createConfetti() {
      const confetti = document.createElement("div");
      confetti.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: ${['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]};
      border-radius: 50%;
      animation: fall ${Math.random() * 2 + 3}s linear;
      `;
    
      // 시작 위치 랜덤 설정
      confetti.style.left = Math.random() * 100 + 'vw';
    
      // 애니메이션 keyframes 동적 생성
      const style = document.createElement('style');
      style.textContent = `
      @keyframes fall {
      0% {
      transform: translateY(-10px) rotate(0deg);
      opacity: 1;
      }
      100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
      }`;
      document.head.appendChild(style);
    
      confettiContainer.appendChild(confetti);
    
      // 애니메이션 종료 후 제거
      setTimeout(() => {
      confetti.remove();
      style.remove();
      }, 4000);
    }
    
    document.body.appendChild(confettiContainer);
    
    // 100개의 폭죽 조각 생성
    for (let i = 0; i < 100; i++) {
      setTimeout(() => createConfetti(), Math.random() * 1000);
    }
    
    // 4초 후 컨테이너 제거
    
   setTimeout(() => confettiContainer.remove(), 4000);
    
  }
  else{ // 방금 제출한 문제가 맞지 않은 경우
    // 틀린점 버튼이 들어갈 위치 추출
    const not_better_pointspan = document.querySelector(".result").firstElementChild;
    const br = document.createElement("br"); 

    // 무슨오류인지 세션스토리지에 저장(Ai에게 전달예정)
    const what_problem = document.querySelector(".result .result-text").innerText
    sessionStorage.setItem('whatproblem',what_problem);
    
    // 문제 번호 추출.
    const problem_menus = document.querySelector(".problem-menu");
    const first_menu = problem_menus.firstElementChild;  
    const problemNumber = first_menu.querySelector("a").innerText.split("번")[0].trim();  // 문제번호 추출
    sessionStorage.setItem('problemNumber',problemNumber);
    console.log(problemNumber); // 문제번호를 세션스토리지에 저장 후 콘솔에 출력

    // 버튼을 추가하고 버튼설정
    const not_better_point = document.createElement("button");
    not_better_point.innerText = "Ai의 해답 보기";
    not_better_point.style.backgroundColor = "red";
    not_better_point.style.color = "#FFFFFF";
    not_better_point.style.textDecorationLine = "none";
    not_better_point.style.border = "none";
    
    // 틀린점 버튼을 눌렀을 때 
    not_better_point.addEventListener('click', () => { // Ai에게 코드를 전달하고 페이지를 수정화면으로 이동, 개선점을 사용자에게 표시 (모달창)

      const pattern = /\/submit\/.*/;

      for (const aTag of document.querySelectorAll("td a")) {
        const hrefValue = aTag.getAttribute("href");
        if (pattern.test(hrefValue)) { // 정규표현식에 맞는 href값 탐색 
          window.location.href = hrefValue; // href 링크로 이동
          sessionStorage.setItem('pagepath',"edit"); // 수정 버튼을 눌러서 submit에 접근한 경우를 식별하기 위해 세션스토리지에 정보 추가 
          break; // 첫 번째 요소를 찾으면 반복문 종료
        }
      };
    });

    not_better_pointspan.appendChild(br);   //줄바꿈
    not_better_pointspan.appendChild(not_better_point);
  };
}

function Solvecheckcheckcheck() {

  // "채점 중" 혹은 "채점 준비중"으로 시작하지 않으면 루프 중지 
  if (!/^채점 중/.test(document.querySelector(".result .result-text").innerText) && !/^채점 준비 중/.test(document.querySelector(".result .result-text").innerText)) {
    clearInterval(checking);
    SolveCheck();
  }
}

const checking = setInterval(Solvecheckcheckcheck, 500); // 채점중이 아닐때까지 0.5초마다 확인 

