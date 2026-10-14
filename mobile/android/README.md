# 동원HUB Android
Android 8 이상용 업무 웹 연동 앱입니다. 패키지 `kr.co.ipharmkorea.dongwonhub`, 버전 1.0.1 / 10001. OTP 로그인, 파일 선택, 뒤로 가기와 새로고침을 지원합니다. 웹에서 생성하는 Blob/CSV 파일은 PC 웹에서 내려받습니다. 오프라인 업무와 네이티브 백그라운드 푸시 알림은 포함되지 않았습니다.
시작 및 로그인 완료 시 새 APK를 확인합니다. 자동 다운로드 후 SHA-256·패키지·버전·동일 서명키를 확인하고 Android 설치 화면을 바로 엽니다. Android에서 요구하는 설치 승인과 처음 한 번의 '이 출처 허용'은 사용자가 완료해야 합니다.
`build.sh`는 API 35 및 build-tools 35.0.0, JDK 17을 사용합니다. 최초 APK와 **같은 서명키**로 새 APK를 제작해야 합니다. GitHub Actions secrets `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`를 설정하면 서명된 업데이트 APK를 별도 빌드합니다. 해당 키는 저장소나 공개 artifact에 저장하지 않습니다. 관리자 앱 배포 화면에 서명된 APK를 등록해야 로그인 시 업데이트가 노출됩니다. 키가 없으면 unsigned 개발용 빌드만 나오며 기존 설치 앱을 업데이트할 수 없습니다.
