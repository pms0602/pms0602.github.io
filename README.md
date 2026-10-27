# 아농허농의 집 — Jekyll + GitHub Pages

개발·보안·기술 학습 기록을 위한 커스텀 Jekyll 블로그입니다.

## 1. GitHub Pages란?

GitHub Pages는 GitHub 저장소의 정적 파일(HTML, CSS, JavaScript 등)을 웹사이트로 공개하는 호스팅 기능입니다. 사용자 사이트 저장소를 `YOUR-GITHUB-ID.github.io`로 만들면 `https://YOUR-GITHUB-ID.github.io` 주소를 사용할 수 있습니다. Jekyll을 사용하면 Markdown 게시글을 HTML 페이지로 생성할 수 있습니다.

## 2. 설정하기

1. GitHub에 `YOUR-GITHUB-ID.github.io`라는 이름의 저장소를 만듭니다.
2. 이 프로젝트 파일을 해당 저장소의 `main` 브랜치에 push합니다.
3. `_config.yml`의 `url`과 `author.github` 값을 본인 계정에 맞게 바꿉니다.
4. GitHub 저장소의 **Settings → Pages**에서 배포 소스를 확인합니다. GitHub Actions/Jekyll 빌드 또는 `Deploy from a branch` 방식 중 저장소 설정에 맞는 방식을 선택합니다.
5. 빌드가 완료되면 `https://YOUR-GITHUB-ID.github.io`에 접속합니다.

> 사용자 사이트 저장소(`YOUR-GITHUB-ID.github.io`)는 `baseurl: ""`을 사용합니다. `my-tech-blog`처럼 프로젝트 사이트로 배포한다면 `url`은 사용자 사이트 도메인으로 두고 `baseurl: "/my-tech-blog"`로 설정해야 합니다.

## 3. 로컬에서 실행하기

Ruby와 Devkit이 설치되어 있어야 합니다.

```bash
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://127.0.0.1:4000`을 엽니다.

## 4. 게시글 추가하기

`_posts` 폴더에 `YYYY-MM-DD-title.md` 형식으로 파일을 만듭니다.

```markdown
---
layout: post
title: "게시글 제목"
date: 2026-10-27 18:00:00 +0900
category: "개발"
tags: [JavaScript, 학습]
description: "게시글 요약"
---

## 첫 번째 소제목

여기에 Markdown으로 글을 작성합니다.
```

카테고리는 아래 여섯 가지 이름 중 하나를 사용하세요. 필터는 이름이 정확히 일치해야 합니다.

- 개발
- CTF/Wargame
- Bug Bounty
- 블로그/기술문서
- 논문/컨퍼런스
- 공모전/자격증

## 5. 변경 사항 올리기

```bash
git add .
git commit -m "Update blog"
git push
```

GitHub Pages 빌드가 끝나면 사이트에 반영됩니다.

## 6. 포함된 기능

- 직접 만든 반응형 레이아웃
- 라이트/다크 모드와 테마 저장
- 해/달이 반시계 방향으로 회전하는 테마 전환 효과
- 카테고리 필터와 게시글 검색
- 게시글 상세 레이아웃과 자동 목차
- RSS 피드 및 SEO 메타데이터
