# 한본어스기루 AI

> 틀린 일본어를 넣으면 실력이 올라가는 앱

## 기능
- 한본어(한국어+일본어 섞인 문장) → 자연스러운 일본어 교정
- 핵심 문법 설명 + JLPT 태그
- 단어별 쪼개기
- 비슷한 표현 / 상황별 표현 (정중 / 보통 / 캐주얼)
- 미니 대화 (3~4턴)
- TTS 음성 듣기 (브라우저 Web Speech API)
- 로컬 저장 (localStorage)

## 기술 스택
- Next.js 14 (Pages Router)
- Anthropic Claude API (claude-haiku-4-5)
- Web Speech API (TTS)
- Vercel 배포

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local
# .env.local에 ANTHROPIC_API_KEY 입력
npm run dev
```

## Vercel 배포

1. GitHub에 push
2. Vercel에서 프로젝트 import
3. Environment Variables → `ANTHROPIC_API_KEY` 추가
4. Deploy

## 비용 참고
- claude-haiku-4-5 사용
- 1회 교정 요청당 약 50~80원 수준
