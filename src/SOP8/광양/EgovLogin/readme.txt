1. 개발자용 개발환경 for Windows 64bit (Implemetation Tool) Version 4.3.1 Download
   - https://www.egovframe.go.kr/home/sub.do?menuNo=94
2. 전자정보 표준프레임워크
   - 4.3.0
   - JDK 17(Oracle JDK 사용금지. Eclipse Temurin 사용할것)
   - https://adoptium.net/en-GB/temurin/releases/?version=17
3. Maven 설치
   - https://maven.apache.org/download.cgi
   - 최신 binary zip 파일 다운로드
   - 특정 폴더에 압축풀고 환경변수에 해당경로를 MAVEN_HOME으로 지정
   - 시스템 Path에 %MAVEN_HOME%\bin 추가
4. 빌드순서
   - base-model
   - base-utility
   - base-dal
   - base-account-ibll
   - base-account-bll
   - webapi
   - 각 서브 프로젝트의 루트 폴더로 가서 아래의 command 실행
      . mvn clean package
      . mvn clean install