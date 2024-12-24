import { defaultsettingDict } from '../functions/setting&functions.js';

const languageSelect = document.getElementById("languageSelect");
const saveButton = document.querySelector(".savebutton");
const settingBtn = document.getElementById('settingbtn');

// 페이지 로드 시 저장된 언어 선택하기
chrome.storage.sync.get(["language"], async(result) => {
    if (result.language != undefined) { // language값이 있으면..
      languageSelect.value = result.language; // 저장된 언어로 선택값 설정
    } 
    else {
      await chrome.storage.sync.set({ language: "Python" }, () => { // 사용자가 팝업을 열기만하고 저장을 누르지 않았을 때 기본선택된 언어인 파이썬으로 저장됨.
    });
    }
});

// 저장 버튼 클릭 이벤트에 대한 이벤트리스너 추가
saveButton.addEventListener("click", async() => {
  const selectedLanguage = languageSelect.value;
  // 선택된 언어 저장
  await chrome.storage.sync.set({ language: selectedLanguage }, () => {
      alert(`선택된 언어가 저장되었습니다: ${selectedLanguage}`);
  });
});

const headdiv = document.querySelector('.header-container');
const bodydiv = document.querySelector('.body-container');

const settingdiv = document.getElementById('settingdivoff');

const savesettingBtn = document.getElementById('savesettingbutton');
savesettingBtn.addEventListener('click',async() => {
  //저장버튼 클릭 -> 현재 값 읽어서 sync스토리지에 저장 
  let settingDict = {
    fontsize : document.getElementById('fontsize').value,
    adremove : document.getElementById('adremove').checked,
    AiFBuse : document.getElementById('AiFBuse').checked,
    timer : document.getElementById('timer').checked,
    stOF : document.getElementById('stOF').checked
  };
  await chrome.storage.sync.set({setting: settingDict});
  alert('저장되었습니다.')
  settingBtn.click();
});

let settingpageopen = false;
settingBtn.addEventListener('click', async() => {  //설정페이지 로드
  settingpageopen = !settingpageopen;
  if (settingpageopen) {
    headdiv.style.display = 'none'; 
    bodydiv.style.display = 'none'; 

    await chrome.storage.sync.get('setting', (setting) => {// 만약 이전에 저장된 값이 없으면 default세팅을 가져옴
      let dict = {};
      if(!setting) dict = defaultsettingDict;
      else dict = setting.setting;

      document.getElementById('fontsize').value = dict.fontsize;
 
      document.getElementById('adremove').checked = dict.adremove;
      document.getElementById('AiFBuse').checked = dict.AiFBuse;
      document.getElementById('timer').checked = dict.timer;
      document.getElementById('stOF').checked = dict.stOF;

    });
    settingdiv.id = 'settingdivon'; // CSS전환
  } else {
    settingdiv.id = 'settingdivoff';
    headdiv.style.display = '';
    bodydiv.style.display = '';
  }
});

