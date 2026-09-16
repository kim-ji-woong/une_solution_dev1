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
4. Tomcat 9.x 다운로드
   - https://tomcat.apache.org/download-90.cgi
5. Tomcat 설치
   - JDK17 설치폴더 지정할 것
   - 다른 옵션은 Default 사용
   - Eclipse 화면 하단의 Servers 뷰에서 우클릭 => New > Server
     . New > Server
     . Apache > Tomcat v9.0 Server 선택
     . Next
     . Tomcat 설치경로 입력
     . Finish
6. Eclipse에서 디버깅 안될때
   - 윈도우 서비스에서 Tomcat 중지
   - Eclipse 메뉴 > Project > Clean => 전체 프로젝트 Clean
   - 프로젝트 우클릭 > Maven > Update Project...
     . Force Update 체크
   - 프로젝트/target/m2e-wtp/web-resources 폴더가 생성되었는지 확인
   - 하단의 Servers 탭에서 Tomcat 서버 우클릭 > Clean
7. server.xml
   - <Server port="8005 " shutdown="SHUTDOWN"> 확인
   - <Connector protocol="AJP/1.3"
               address="::1"
               port="8009"
               redirectPort="8443"
               maxParameterCount="1000"
			   secretRequired="false"
               />
8. 의존성 주입
   - @Autowired
   - 의존성 주입이 필요한 클래스내 Field 위에 추가할 것
9. context-datasource.xml
   - SQL Server의 경우 encrypt=true;trustServerCertificate=true 항목이 반드시 필요함
     <property name="url" value="jdbc:sqlserver://localhost:1433;databaseName=WSOP_110;encrypt=true;trustServerCertificate=true;"/>
   - 개발환경에서는 trustServerCertificate=true 이렇게 하지만, 운영환경에서는 trustServerCertificate=false로 하고 공식 인증서(CA) 기반 설정 권장
10. Spring Boot 기반으로 개발할 경우
   - dao 프로젝트에서 application.properties에 MyBatis 설정 추가할 것
     # MyBatis 설정 추가
     mybatis.mapper-locations=classpath*:mapper/**/*.xml
     mybatis.type-aliases-package=egovframework.example.user.domain
   - egovframework.example.user.domain 이 부분은 실제 VO 클래스들이 존재하는 경로를 나타낸다.
   - VO(Value Object) 클래스가 여러 경로에 나뉘어져 있다면 최상위 폴더의 package를 사용한다.
   - 만일 VO 클래스를 사용하지 않는다면 주석으로 막아 놓는다.
11. controller 모듈
   - pom.xml 파일에 다음을 추가한다.
<build>
		<finalName>모듈이름(자유롭게)</finalName>
		<plugins>
		    <plugin>
		      <groupId>org.apache.maven.plugins</groupId>
		      <artifactId>maven-war-plugin</artifactId>
		      <version>3.3.2</version>
		      <configuration>
		        <failOnMissingWebXml>false</failOnMissingWebXml>
		        <archive>
		          <manifest>
		            <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
		          </manifest>
		        </archive>
		      </configuration>
		    </plugin>
  		</plugins>
	</build>
12. 그 밖의 하위 모듈
    - pom.xml 파일에 다음을 추가한다.
<build>
		<finalName>모듈이름(자유롭게)</finalName>
		<resources>
		    <resource>
		      <directory>src/main/resources</directory>
		      <includes>
		        <include>**/*.xml</include>
		      </includes>
		    </resource>
		</resources>
		<plugins>
		    <plugin>
		      <groupId>org.apache.maven.plugins</groupId>
			  <artifactId>maven-jar-plugin</artifactId>
			  <version>3.2.2</version>
		      <configuration>
		        <archive>
				  <addMavenDescriptor>true</addMavenDescriptor>
		          <manifest>
		            <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
		          </manifest>
		        </archive>
		      </configuration>
		    </plugin>
  		</plugins>
	</build>