# 🐕 강아지 사전 (Dog Dictionary)

강아지 품종 정보를 검색하고, 사용자가 직접 사진을 업로드할 수 있는 웹 애플리케이션입니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
  - [사전 준비](#사전-준비)
  - [MySQL 설정](#mysql-설정)
  - [백엔드 설정](#백엔드-설정)
  - [프론트엔드 설정](#프론트엔드-설정)
- [환경 변수](#환경-변수)
- [API 문서](#api-문서)
- [스크린샷](#스크린샷)
- [문제 해결](#문제-해결)

## 🎯 주요 기능

- 🔍 **강아지 품종 검색**: 이름 또는 설명으로 검색
- 📝 **품종 정보**: 각 품종의 상세 설명 및 이미지
- 📸 **사진 업로드**: 사용자가 직접 강아지 사진 업로드
- 🖼️ **사진 갤러리**: 업로드된 사진을 그리드로 보기
- 🔐 **관리자 기능**: 새로운 품종 등록 (관리자 키 필요)
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 🛠 기술 스택

### Backend
- **Python 3.8+**
- **FastAPI**: 웹 프레임워크
- **SQLAlchemy**: ORM
- **PyMySQL**: MySQL 드라이버
- **Pydantic**: 데이터 검증
- **Uvicorn**: ASGI 서버

### Frontend
- **React 18**: UI 라이브러리
- **Vite**: 빌드 도구
- **React Router**: 라우팅
- **Axios**: HTTP 클라이언트
- **Tailwind CSS**: 스타일링

### Database
- **MySQL 8.0+**

## 📁 프로젝트 구조

```
dog-dictionary/
├── backend/
│   ├── database.py          # 데이터베이스 연결
│   ├── models.py            # SQLAlchemy 모델
│   ├── schemas.py           # Pydantic 스키마
│   ├── dogs_router.py       # API 라우터
│   ├── main.py              # FastAPI 앱
│   ├── uploads/             # 업로드된 이미지
│   ├── .env                 # 환경 변수 (생성 필요)
│   └── requirements.txt     # Python 패키지
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                 # 환경 변수 (생성 필요)
└── README.md
```

## 🚀 시작하기

### 사전 준비

다음 프로그램이 설치되어 있어야 합니다:

- **Python 3.8 이상**
- **Node.js 16 이상** (npm 포함)
- **MySQL 8.0 이상**
- **Git**

### 1️⃣ 저장소 클론

```bash
git clone https://github.com/your-username/dog-dictionary.git
cd dog-dictionary
```

### 2️⃣ MySQL 설정

#### MySQL 접속

```bash
mysql -u root -p
```

#### 데이터베이스 및 사용자 생성

```sql
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS dogdb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 사용자 생성 및 권한 부여
CREATE USER 'doguser'@'localhost' IDENTIFIED BY 'dogpassword123';
GRANT ALL PRIVILEGES ON dogdb.* TO 'doguser'@'localhost';

-- 원격 접속이 필요한 경우
CREATE USER 'doguser'@'%' IDENTIFIED BY 'dogpassword123';
GRANT ALL PRIVILEGES ON dogdb.* TO 'doguser'@'%';

FLUSH PRIVILEGES;

-- dogdb 사용
USE dogdb;

-- 테이블 생성
CREATE TABLE dogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(512),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dog_id INT,
  photo_url VARCHAR(512) NOT NULL,
  uploaded_by VARCHAR(255),
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE SET NULL
);
```

### 3️⃣ 백엔드 설정

#### 패키지 설치

```bash
cd backend

# 가상환경 생성 (권장)
python -m venv venv

# 가상환경 활성화
# Windows (CMD)
venv\Scripts\activate
# Windows (PowerShell)
venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate

# 패키지 설치
pip install -r requirements.txt
```

#### 환경 변수 설정

`backend/.env` 파일 생성:

```env
DATABASE_URL=mysql+pymysql://doguser:dogpassword123@localhost:3306/dogdb
ADMIN_KEY=supersecret
```

#### 백엔드 실행

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

백엔드가 `http://localhost:8000`에서 실행됩니다.

#### API 문서 확인

브라우저에서 접속:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 4️⃣ 프론트엔드 설정

#### 새 터미널 열기

```bash
cd frontend
```

#### 패키지 설치

```bash
npm install
```

#### Tailwind CSS 설정

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 환경 변수 설정

`frontend/.env` 파일 생성:

```env
VITE_API_BASE=http://localhost:8000
```

#### 프론트엔드 실행

```bash
npm run dev
```

프론트엔드가 `http://localhost:3000`에서 실행됩니다.
/*안되면 3001로 해보시오 */

## 🌐 애플리케이션 접속

브라우저에서 `http://localhost:3000` 접속

## 🔐 환경 변수

### Backend (.env)

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DATABASE_URL` | MySQL 연결 문자열 | `mysql+pymysql://user:pass@localhost:3306/dogdb` |
| `ADMIN_KEY` | 관리자 API 키 | `supersecret` |

### Frontend (.env)

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_API_BASE` | 백엔드 API URL | `http://localhost:8000` |

## 📡 API 문서

### 강아지 목록 조회

```bash
GET /api/v1/dogs?search=시바&page=1&limit=10
```

### 강아지 상세 조회

```bash
GET /api/v1/dogs/{dog_id}
```

### 강아지 등록 (관리자)

```bash
POST /api/v1/dogs
Headers: X-Admin-Key: supersecret
Body: {
  "name": "시바견",
  "description": "귀여운 강아지"
}
```

### 사진 업로드

```bash
POST /api/v1/dogs/{dog_id}/photos
Content-Type: multipart/form-data
Body: 
  - file: (이미지 파일)
  - uploaded_by: "anonymous"
```

## 🖼 스크린샷

### 메인 화면
강아지 목록을 카드 형태로 표시하며, 검색 기능을 제공합니다.

### 상세 화면
강아지의 상세 정보와 사용자가 업로드한 사진 갤러리를 볼 수 있습니다.

### 관리자 화면
새로운 강아지 품종을 등록할 수 있습니다.

## 🔧 문제 해결

### MySQL 연결 오류

**문제**: `Access denied for user`

**해결**:
```sql
-- MySQL에서 권한 재설정
GRANT ALL PRIVILEGES ON dogdb.* TO 'doguser'@'localhost';
FLUSH PRIVILEGES;
```

**문제**: `Can't connect to MySQL server`

**해결**:
- MySQL 서비스가 실행 중인지 확인
- Windows: `services.msc`에서 MySQL 서비스 확인
- macOS/Linux: `sudo systemctl status mysql`

### 포트 충돌

**백엔드 포트 변경**:
```bash
uvicorn main:app --reload --port 8001
```

**프론트엔드 포트 변경**:
```bash
npm run dev -- --port 3001
```

### 이미지 업로드 오류

**문제**: 이미지가 업로드되지 않음

**해결**:
- `backend/uploads/` 폴더 권한 확인
- 파일 크기 제한 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 프론트엔드 빌드 오류

**문제**: Tailwind CSS가 적용되지 않음

**해결**:
```bash
# Tailwind 재설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 개발 서버 재시작
npm run dev
```

## 📝 개발 팁

### 테스트 데이터 추가

```bash
# 관리자 키로 강아지 등록
curl -X POST 'http://localhost:8000/api/v1/dogs' \
  -H 'Content-Type: application/json' \
  -H 'X-Admin-Key: supersecret' \
  -d '{
    "name": "시바견",
    "description": "일본의 국견으로 알려진 중소형견입니다."
  }'
```

### 프로덕션 빌드

**프론트엔드**:
```bash
cd frontend
npm run build
# dist/ 폴더에 빌드 결과 생성
```

**백엔드**:
```bash
# Gunicorn 사용 (프로덕션)
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.

## 👤 작성자

Your Name - [@yourhandle](https://twitter.com/yourhandle)

프로젝트 링크: [https://github.com/your-username/dog-dictionary](https://github.com/your-username/dog-dictionary)

## 🙏 감사의 말

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
