# Next.js CI/CD 파이프라인 구축

## 프로젝트 소개

AWS S3를 이용해서 Next.js 애플리케이션의 정적 파일을 호스팅하고, CloudFront를 활용해서 콘텐츠를 효율적으로 전달하는 CDN을 구성한 후, Next.js 프로젝트에 GitHub Actions를 통한 자동 배포 파이프라인을 구축하여 개발 생산성을 향상시킨 프로젝트입니다.

## 상세 구현 내용

### 1. AWS 인프라 구성

#### S3 버킷 설정

- 버킷 생성 및 정적 웹 사이트 호스팅 활성화
- 퍼블릭 액세스 차단 설정
- CloudFront 배포를 위한 버킷 정책 설정

#### CloudFront 설정

- Origin Domain 설정 (S3 버킷 연결)
- OAI(Origin Access Identity) 생성 및 연결
- 기본 캐시 동작 설정 (Redirect HTTP to HTTPS)
- 오류 페이지 설정 (/index.html로 리다이렉트)

### 2. Next.js 프로젝트 설정

#### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 정적 내보내기 설정
  trailingSlash: true,
}

module.exports = nextConfig
```

### 3. CI/CD 파이프라인 구축

#### GitHub Actions 워크플로우 (.github/workflows/deploy.yml)

```yaml
name: Deploy Next.js to S3 and invalidate CloudFront

on:
  push:
    branches:
      - main # 또는 master, 프로젝트의 기본 브랜치 이름에 맞게 조정
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy to S3
        run: |
          aws s3 sync out/ s3://${{ secrets.S3_BUCKET_NAME }} --delete

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

#### GitHub Secrets 설정

필요한 시크릿 값:

- AWS_ACCESS_KEY_ID : IAM 계정 생성시 발급받는 액세스 키
- AWS_SECRET_ACCESS_KEY : IAM 계정 생성시 발급받은 비밀 엑세스 키
- AWS_REGION : S3을 세팅한 region(지역) 코드
- S3_BUCKET_NAME : 빌드 산출물을 업로드할 S3 버킷 이름
- CLOUDFRONT_DISTRIBUTION_ID : S3과 연결된 CloudFront 배포 ID

### 4. 배포 프로세스

1. main 브랜치에 코드 merge & push
2. GitHub Actions 워크플로우 자동 실행
3. Next.js 프로젝트 빌드
4. 빌드된 파일을 S3에 업로드
5. CloudFront 캐시 무효화

### 5. 주요 개념

#### **GitHub Actions과 CI/CD 도구**

GitHub Actions는 소프트웨어 개발 워크플로우를 자동화하는 CI/CD 플랫폼입니다. 코드 변경사항이 main 브랜치에 푸시되면 자동으로 빌드, 테스트, 배포 과정을 실행합니다. 이를 통해 개발자는 수동 작업 없이 안정적인 배포를 수행할 수 있습니다.

#### **S3와 스토리지**

Amazon S3(Simple Storage Service)는 확장 가능한 객체 스토리지 서비스입니다. 이 프로젝트에서는 Next.js로 빌드된 정적 파일들을 호스팅하는 용도로 사용됩니다. 정적 웹사이트 호스팅 기능을 통해 웹 서버 없이도 콘텐츠를 제공할 수 있습니다.

#### **CloudFront와 CDN**

CloudFront는 AWS의 CDN(Content Delivery Network) 서비스입니다. 전 세계에 분산된 엣지 로케이션을 통해 콘텐츠를 캐싱하고 사용자와 가까운 위치에서 콘텐츠를 제공함으로써 지연 시간을 최소화하고 성능을 향상시킵니다.

#### **캐시 무효화(Cache Invalidation)**

CloudFront는 엣지 로케이션에서 콘텐츠를 캐싱하여 제공합니다. 새로운 배포가 이루어질 때 이전 캐시된 콘텐츠를 무효화하여 사용자가 항상 최신 버전의 콘텐츠를 받을 수 있도록 합니다. 워크플로우의 마지막 단계에서 create-invalidation 명령어를 통해 수행됩니다.

#### **Repository Secret과 환경변수**

GitHub Repository의 Secrets 설정을 통해 AWS 인증 정보와 같은 민감한 정보를 안전하게 관리합니다. 이 값들은 워크플로우 실행 시 환경변수로 주입되어 사용됩니다.

### 6. 주요 이점

- 자동화된 배포로 인한 개발 생산성 향상
- CloudFront CDN을 통한 글로벌 콘텐츠 전송
- S3 정적 호스팅을 통한 비용 효율적인 운영

### 7. 실무 적용시 고려사항

#### DNS 및 도메인 설정

Route 53을 통한 도메인 관리
ACM 인증서를 통한 HTTPS 설정

mermaidCopygraph LR
A[Route 53] --> B[CloudFront]
B --> C[S3]

#### 모니터링 및 알림

CloudWatch를 통한 메트릭 모니터링
SNS를 통한 배포 결과 알림
에러 로깅 및 추적

#### 보안 설정

S3 버킷 정책 최소 권한 원칙 적용
CloudFront OAI 설정
WAF 규칙 적용 (필요시)
