/* 
 * 
 * 
 * 광고제거
 * 
 * 
 */

function RemoveAds(){
  const adClassList = ['.GoogleActiveViewElement','.jar','.adsbygoogle','.main-slider-ad','.text-center no-print'];
  const adIDList = ['ad-container'];

    // 제거할 div의 클래스명을 알고 있는 경우

    adClassList.forEach(CName => {
      const adDivs = document.querySelectorAll(CName); // 광고 클래스리스트의 해당항목을 모두 찾는다. 
      if(adDivs) adDivs.forEach(adDiv => {adDiv.remove()}); // 클래스리스트의 항목이 존재하면 해당하는 클래스리스트의 모든 항목을 제거한다. 
    })
    
    // 제거할 div의 ID를 알고 있는 경우

    adIDList.forEach(IDName => {
      const adDivs = document.getElementById(IDName); 
      if(adDivs) adDivs.forEach(adDiv => {adDiv.remove()}); 
    })
  
  };


RemoveAds(); //광고없애기(acmipc.net에서만)