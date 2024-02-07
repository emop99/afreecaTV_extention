# 아프리카 TV 확장 프로그램 프로젝트 - WePL
#### [* 아프리카 TV 확장 프로그램 홈페이지](https://developers.afreecatv.com/?szWork=extension)
#### [* 아프리카 TV 확장 프로그램 공모전](https://extchallenge.afreecatv.com/)

### 프로젝트 소개
- BJ들이 시청자 간의 참여 시청자 참여 콘테츠 진행을 도와주는 아프리카 TV 확장 프로그램입니다.

### 작동 방식
- BJ와 유저간에 ExtensionSDK API를 통해 메시지를 JSON 형태로 변환하여 통신합니다.
  - (개인 정보 보호를 위해 개별 서버를 두어 저장은 불가하다고 답변 받았습니다)
- 시퀀스 다이어그램
  - 제작 예정

### 폴더 구조
- [css](css)
  - [fonts](fonts)
  - [pretendard.css](css%2Fpretendard.css)
  - [pretendard-subset.css](css%2Fpretendard-subset.css)
  - [style.css](css%2Fstyle.css)
- [images](images)
- [js](js)
  - [lib](js%2Flib) : 외부 라이브러리
    - [jquery-1.12.4.js](js%2Flib%2Fjquery-1.12.4.js)
  - [modules](js%2Fmodules) : 공통 모듈
    - [afreeca.js](js%2Fmodules%2Fafreeca.js) : 아프리카 TV 확장 프로그램 API 관련 모듈
    - [common.js](js%2Fmodules%2Fcommon.js) : 공통 모듈
    - [config.js](js%2Fmodules%2Fconfig.js) : 환경 설정 모듈
    - [modal.js](js%2Fmodules%2Fmodal.js) : 모달 관련 모듈
  - [main_bj.js](js%2Fmain_bj.js) : BJ 화면 JS
  - [main_user.js](js%2Fmain_user.js) : 시청자 화면 JS
- [bj_screen.html](bj_screen.html) : BJ 화면
- [mo_user_screen.html](mo_user_screen.html) : 모바일 시청자 화면
- [user_screen.html](user_screen.html) : 시청자 화면

### 소스 구조
  - template
    - 랜더링에 필요한 HTML 템플릿을 모은 함수
  - render
    - 랜더링을 모은 함수
  - event
    - EventListener 및 각종 이벤트 처리를 모은 함수
  - api
    - 아프리카 TV 확장 프로그램 API를 모은 함수
  - messageListener
    - 아프리카 TV 확장 프로그램 메시지 수신 처리를 모은 함수

### 수상
 - ![awards_img.png](awards_img.png)