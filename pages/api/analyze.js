export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;
  if (!input || !input.trim()) {
    return res.status(400).json({ error: '입력 문장이 없어요.' });
  }

  const SYSTEM = `You are a Japanese language learning assistant for Korean speakers who produce "한본어" (Hanbeoneo) — mixed Korean-Japanese text.

Analyze the input and return ONLY a valid JSON object. No markdown, no backticks, no extra text — raw JSON only.

Required JSON structure:
{
  "corrected": "correct natural Japanese sentence",
  "hiragana": "hiragana reading with spaces between words",
  "koreanPron": "Korean pronunciation guide (e.g. 카이센 와 타베마센)",
  "koreanTranslation": "자연스러운 한국어 번역 1문장",
  "status": "short status in Korean (e.g. '해산물 관련 한본어 감지 완료')",
  "summary": ["correction point 1 in Korean", "correction point 2", "correction point 3"],
  "grammarPoints": [
    {"title": "grammar name", "level": "N5", "desc": "2-sentence explanation in Korean"}
  ],
  "examTags": ["JLPT N5", "부정형", "식당 회화 빈출"],
  "tokens": [
    {"jp": "word", "hira": "hiragana", "kr": "pronunciation", "meaning": "Korean meaning", "note": "usage note in Korean", "emoji": "단어 뜻을 나타내는 이모지 1개 (조사/접속사는 생략)", "commonForm": "현지인이 가장 많이 쓰는 표기 (한자/가나/카타카나 중 하나, 교정 문장과 동일하면 생략)"}
  ],
  "similar": [
    {"title": "Japanese", "hira": "hiragana", "kr": "pronunciation", "ko": "자연스러운 한국어 번역", "nuance": "Korean nuance", "examTags": ["JLPT N5"], "breakdown": [{"jp":"","hira":"","kr":"","meaning":""}]}
  ],
  "situational": [
    {"label": "situation in Korean", "title": "Japanese", "hira": "hiragana", "kr": "pronunciation", "ko": "자연스러운 한국어 번역", "examTags": ["JLPT N5"], "breakdown": [{"jp":"","hira":"","kr":"","meaning":""}]}
  ],
  "dialogues": [
    {"title": "title in Korean", "turns": [{"who":"A","jp":"Japanese","hira":"hiragana","kr":"pronunciation","ko":"Korean translation"}]}
  ]
}

Rules: grammarPoints 2-3개, examTags 3-5개, tokens은 교정 문장의 모든 단어/조사 포함, similar 2-3개, situational 3개(정중/보통/캐주얼), dialogues 1개(3-4턴). 모든 설명은 한국어로. JSON만 반환.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 5000,
        system: SYSTEM,
        messages: [{ role: 'user', content: input.trim() }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: `API 오류: ${response.status}`, detail: err });
    }

    const data = await response.json();
    const raw = (data.content || []).map((c) => c.text || '').join('');

    // JSON 블록 추출
    let jsonStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // 중괄호 기준으로 JSON 범위 찾기
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      jsonStr = jsonStr.slice(start, end + 1);
    }

    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch {
      // dialogues 등 배열이 잘린 경우 복구 시도
      try {
        const fixed = jsonStr
          .replace(/,\s*$/, '')        // 끝 쉼표 제거
          .replace(/\}\s*$/, '}}')     // 닫힘 괄호 보완
          .replace(/\]\s*\}?\s*$/, ']}'); // 배열 닫힘 보완
        result = JSON.parse(fixed);
      } catch {
        return res.status(500).json({ error: '응답 파싱 실패. 다시 시도해 주세요.' });
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
