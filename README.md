# Daily Planner — PC + Android 동기화 버전

현재 플래너 UI를 유지하면서 Supabase 로그인/클라우드 저장을 추가한 프로젝트입니다. Supabase Auth는 이메일/비밀번호 로그인을 지원하고, 세션을 브라우저에 유지할 수 있습니다.

## 1. Supabase 준비
1. Supabase에서 새 프로젝트를 만듭니다. Free 플랜으로 시작할 수 있습니다.
2. SQL Editor에서 `supabase-schema.sql` 전체를 실행합니다.
3. Project Settings → API에서 Project URL과 Publishable key를 확인합니다.
4. `.env.example`을 복사해 `.env`로 이름을 바꾸고 두 값을 입력합니다.

## 2. PC에서 실행
```
npm install
npm run dev
```
브라우저에 표시되는 주소를 엽니다.

## 3. 회원가입
처음 실행하면 이메일/비밀번호로 회원가입합니다. Supabase에서 이메일 확인이 켜져 있으면 받은 인증 메일을 확인한 뒤 로그인합니다.

## 4. 배포
`npm run build` 후 `dist` 폴더를 HTTPS 웹호스팅에 올립니다. 배포 주소를 PC에서 사용하고, Android Chrome에서 같은 주소를 열어 '앱 설치/홈 화면에 추가'하면 됩니다.

## 5. 데이터 동기화
같은 계정으로 로그인하면 플래너 데이터가 Supabase의 `planner_data`에 저장되어 PC와 Android에서 공유됩니다. 저장 중 네트워크가 끊겨도 브라우저 캐시에 최근 데이터가 남도록 구성했습니다.

### 참고
Supabase Free 플랜은 현재 월 $0이며 프로젝트당 500MB DB, 50,000 MAU 등을 제공합니다. 장기간 사용하지 않은 Free 프로젝트는 일시 중지될 수 있습니다. 실제 서비스 운영 전에 현재 요금/제한을 다시 확인하세요.
