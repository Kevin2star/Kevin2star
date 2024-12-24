// 페이지가 로드되거나 업데이트될 때마다 탭의 정보를 가져오는 리스너 추가.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    
    //URL패턴별로 content.js에 보낼 메세지 생성
    const urlPatterns = [
      { pattern: /^https:\/\/www\.acmicpc\.net.*/, message: { problem: "this is BOJ URL" } },
      { pattern: /^https:\/\/www\.acmicpc\.net\/problem\/.*/, message: { problem: "this is problemURL" } },
      { pattern: /^https:\/\/www\.acmicpc\.net\/submit\/.*/, message: { submit: "this is submitURL" } },
      { pattern: /^https:\/\/www\.acmicpc\.net\/status?.*&from_mine/, message: { Mysubmit: "this is MysubmitURL" } }
    ];

    for (const { pattern, message } of urlPatterns) {
      if (pattern.test(tab.url)) { 
        chrome.tabs.sendMessage(tab.id, message);
      }
    }
  }
});

// content.js에서 받아온 문제번호를 크롬sync스토리지에 저장하는 함수
async function saveProblemNumber(problemNumber) { 
  try {
    await chrome.storage.sync.set({ problemNum: problemNumber }); // 문제번호를 크롬sync스토리지에 저장 sync스토리지는 사용자의 정보 등을 저장 하기 위한 저장공간 

  } catch (error) { // 에러캐치
    console.error("문제 번호를 sync 스토리지에 저장하는 중 오류 발생:", error);
  }
}

// 사이드 패널 열기 및 설정을 처리하는 공통 함수
async function openSidePanel(sender, path) {
  try {
    // 현재 탭에 맞게 사이드 패널 열기
    await chrome.sidePanel.open({ tabId: sender.tab.id }); // 사이드 패널 활성화

    // 사이드패널 설정 
    await chrome.sidePanel.setOptions({
      tabId: sender.tab.id,
      path: path,
      enabled: true  
    });
  } catch (error) {
    console.error(`${path} 사이드 패널을 여는 중 오류 발생:`, error);
  }
}

// 메시지 처리 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, problemNumber } = message;  // 메시지에서 action과 problemNumber 추출

  // 각 액션에 따라 처리할 사이드 패널 경로 설정
  const sidePanelPaths = {
    'IH_sidepanel_open': '../sidepanels/IH.html',
    'WS_sidepanel_open': '../sidepanels/WS.html',
    'OQ_sidepanel_open': '../sidepanels/OQ.html',
  };

  const path = sidePanelPaths[action];

  if (path) {

    // 문제 번호 저장
    async function storagesavePN(){
      await saveProblemNumber(problemNumber); // content.js에서 받아온 문제번호를 sync스토리지에 저장
      
      // 성공 응답을 content.js로 전송
      sendResponse({ status: 'success' });
    };
    storagesavePN();

    // 사이드 패널 열기
    openSidePanel(sender, path);
  }
  else {
    console.error(`알 수 없는 액션: ${action}`);
    sendResponse({ status: 'error', message: `알 수 없는 액션: ${action}` });
  }

  return true;  // 비동기 응답을 위해 true 반환
});


