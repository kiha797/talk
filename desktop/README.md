# 동원HUB 메신저 (Windows)

Windows 64비트용 작은 독립 창입니다. 웹 서비스 `https://talk.ipharmkorea.com/`의 같은 계정과 데이터를 사용합니다. 사이트는 온라인 상태여야 합니다.

`npm ci --ignore-scripts` 후 `npm run dist:win`으로 설치 파일을 생성합니다. Linux에서는 electron-builder가 내려받은 NSIS의 `makensis`를 사용하며, 위치가 다르면 `MAKENSIS` 환경 변수를 지정합니다. 실행 파일과 설치 파일에 코드 서명 인증서는 적용되지 않았습니다.

설치 경로 기본값은 `C:\Program Files\동원HUB 메신저`입니다. 창을 닫으면 트레이에 남고, 트레이 메뉴의 종료로 앱을 완전히 닫습니다. Windows 앱과 PC 웹은 같은 서버를 보지만 각각의 로그인 세션은 별도로 유지합니다.

## 1.1.0
시작 및 로그인 완료 시 새 버전 확인·자동 다운로드·SHA-256 검사를 수행합니다. Windows Authenticode 서명이 유효한 업데이트만 사용자 설치 확인 후 실행합니다. 업무 웹 화면은 로그인 전에 최신 빌드를 확인합니다. 초기 설치 파일은 회사 코드 서명 인증서가 제공되지 않아 서명되지 않았습니다. SmartScreen 무경고 설치를 보장하지 않습니다. Program Files 업데이트에는 UAC 승인이 필요할 수 있습니다. 버전 코드는 major*10000+minor*100+patch이며 1.1.0은 10100입니다.
