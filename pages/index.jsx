import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

const SAMPLES = [
  '해산물 와 타베마센',
  '와타시 배 고파요',
  '나 오늘 피곤데스',
  '문네가 아파',
  '스미마센 이거 얼마예요',
];

function Chip({ text }) {
  const isJlpt = text.includes('JLPT');
  const cls = isJlpt ? 'chip jlpt' : 'chip tag';
  return <span className={cls}>{text}</span>;
}

function SpeakBtn({ text, label = '🔊 듣기' }) {
  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const jpVoice = voices.find((v) => v.lang && v.lang.includes('ja'));
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = 0.85;
    if (jpVoice) u.voice = jpVoice;
    window.speechSynthesis.speak(u);
  };
  return (
    <button className="speak-btn" onClick={speak}>
      {label}
    </button>
  );
}

function TokenList({ tokens, maxVisible }) {
  if (!tokens?.length) return <div className="empty">단어 정보가 없어요.</div>;
  const visible = maxVisible ? tokens.slice(0, maxVisible) : tokens;
  const rest = maxVisible ? tokens.slice(maxVisible) : [];
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? tokens : visible;
  return (
    <div className="token-scroll-wrap">
      <div className="token-scroll">
        {displayed.map((t, i) => (
          <div className="token token-card" key={i}>
            <div className="token-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {t.emoji && <span style={{ fontSize: 22 }}>{t.emoji}</span>}
                <div>
                  <div className="jp">{t.jp}</div>
                  <div className="muted">{t.hira} · {t.kr}</div>
                </div>
              </div>
              <span className="chip">{t.meaning}</span>
            </div>
            {t.commonForm && (
              <div style={{ marginTop: 6, fontSize: 12, background: '#f0f7e8', border: '1.5px solid #b8d9a0', borderRadius: 7, padding: '5px 10px', color: '#3a6020' }}>
                현지 표기 <strong>{t.commonForm}</strong>
              </div>
            )}
            {t.note && <div className="tiny" style={{ marginTop: 4 }}>{t.note}</div>}
            <div className="speak-row"><SpeakBtn text={t.jp} /></div>
          </div>
        ))}
        {!showAll && rest.length > 0 && (
          <div className="token token-card token-more" onClick={() => setShowAll(true)}>
            <div style={{ fontSize: 13, color: '#888', textAlign: 'center', paddingTop: 8 }}>+{rest.length}개 더보기</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExprItem({ item, categoryLabel }) {
  return (
    <details>
      <summary>
        <span>{item.title}</span>
        <span className="muted">{categoryLabel || item.nuance || item.label || ''}</span>
      </summary>
      <div className="details-body">
        <div className="jp">{item.title}</div>
        <div className="muted" style={{ marginTop: 2 }}>{item.hira} · {item.kr}</div>
        {item.nuance && <div className="muted" style={{ marginTop: 4 }}>{item.nuance}</div>}
        <div style={{ marginTop: 6 }}>
          {(item.examTags || []).map((t, i) => <Chip key={i} text={t} />)}
        </div>
        <div className="speak-row"><SpeakBtn text={item.title} /></div>
        {(item.breakdown || []).map((b, i) => (
          <div className="token" key={i} style={{ marginTop: 8 }}>
            <div className="token-head">
              <div>
                <div className="jp">{b.jp}</div>
                <div className="muted">{b.hira} · {b.kr}</div>
              </div>
              <span className="chip">{b.meaning}</span>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

const ROLE_EMOJI = {
  A: '🙋', B: '🧑‍💼', C: '👨‍🍳', D: '👩‍🏫',
  '손님': '🙋', '종업원': '🧑‍💼', '점원': '🧑‍💼', '선생님': '👩‍🏫', '학생': '📚',
};
function getRoleEmoji(who) {
  if (ROLE_EMOJI[who]) return ROLE_EMOJI[who];
  return who?.length <= 2 ? '💬' : '🙋';
}

function DialogueItem({ dialogue }) {
  const allJp = (dialogue.turns || []).map((t) => t.jp).join(' ');
  return (
    <details open>
      <summary>
        <span>{dialogue.title}</span>
        <span className="muted">대화 {dialogue.turns?.length || 0}턴</span>
      </summary>
      <div className="details-body">
        <div className="speak-row">
          <SpeakBtn text={allJp} label="🔊 대화 전체 듣기" />
        </div>
        {(dialogue.turns || []).map((turn, i) => (
          <div className="dialogue-turn" key={i}>
            <div className="avatar" style={{ fontSize: 16, background: 'transparent', border: 'none' }}>
              {getRoleEmoji(turn.who)}
            </div>
            <div>
              <div className="turn-jp">{turn.jp}</div>
              <div className="turn-sub">{turn.hira} · {turn.kr}</div>
              <div className="turn-sub">{turn.ko}</div>
              <div className="speak-row"><SpeakBtn text={turn.jp} /></div>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [saved, setSaved] = useState([]);
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('hbsAI_v1') || '[]');
      setSaved(s);
    } catch {}
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const showToastMsg = useCallback((msg) => {
    setToast(msg);
    setShowToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2200);
  }, []);

  const persistSaved = (items) => {
    setSaved(items);
    localStorage.setItem('hbsAI_v1', JSON.stringify(items));
  };

  const saveResult = () => {
    if (!result) { showToastMsg('먼저 교정해 주세요.'); return; }
    const item = {
      ...result,
      originalInput: input.trim(),
      savedAt: new Date().toLocaleString('ko-KR'),
    };
    const next = [item, ...saved];
    persistSaved(next);
    showToastMsg('저장 완료!');
  };

  const clearSaved = () => {
    if (confirm('저장 목록을 전부 지울까요?')) {
      persistSaved([]);
      showToastMsg('삭제했어요.');
    }
  };

  const analyze = async () => {
    const txt = input.trim();
    if (!txt) { showToastMsg('문장을 입력해 주세요.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: txt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `서버 오류 ${res.status}`);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>한본어스기루 AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="desktop">
        <div className="star s1" />
        <div className="star s2" />
        <div className="star s3" />
        <div className="star s4" />
        <div className="star s5" />
        <div className="star s6" />

        <div className="window-wrap">
          <div className="window">
            <div className="titlebar">
              <div className="lights">
                <span className="light"></span>
                <span className="light" style={{ background: '#d8e9df' }}></span>
                <span className="light" style={{ background: '#efd8d8' }}></span>
              </div>
              <div className="title-text">한본어스기루</div>
              <div />
            </div>

            <div className="window-body">
              {/* 사이드바 */}
              <aside className="side-panel">
                <div className="pixel-card brand-card">
                  <div>
                    <img
                      src="/%EB%8B%A8%EB%9D%BD%20%ED%85%8D%EC%8A%A4%ED%8A%B8%20(1).png"
                      alt="한본어스기루"
                      style={{ width: '100%', borderRadius: 8, display: 'block' }}
                    />
                    <p className="brand-sub" style={{ marginTop: 12 }}>
                      입 밖으로 나온 한본어, 진짜 일본어가 될 때까지.
                    </p>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <span className="chip">교정</span>
                    <span className="chip">문법</span>
                    <span className="chip jlpt">JLPT</span>
                    <span className="chip">미니 대화</span>
                    <span className="chip">리스닝</span>
                  </div>
                </div>
              </aside>

              {/* 메인 */}
              <main className="main-panel">
                <section className="hero">
                  <div>
                    <h1>말하고 싶은 그대로 입력하면 공부가 시작됩니다.</h1>
                    <p>
                      히라가나와 한국어 발음은 물론, 핵심 문법 구조까지 실시간으로 교정해 드립니다. 내가 뱉은 단어로 학습해야 진짜 내 실력이 됩니다.
                    </p>
                  </div>
                </section>

                {/* 입력 */}
                <section className="pixel-card">
                  <div className="section-title">
                    <h2>입력</h2>
                  </div>
                  <div className="input-grid">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) analyze(); }}
                      placeholder={'예: 해산물 와 타베마센\n예: 와타시 배 고파요\n예: 스미마센 이거 얼마예요'}
                    />
                    <div className="button-stack">
                      <button className="primary" onClick={analyze} disabled={loading}>
                        {loading ? '분석 중...' : '교정 시작'}
                      </button>
                      <button className="tertiary" onClick={() => setInput('')}>입력 지우기</button>
                    </div>
                  </div>
                </section>

                {/* 로딩 */}
                {loading && (
                  <div className="pixel-card loading-wrap">
                    <div className="muted">분석 중이에요...</div>
                    <div className="loading-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                )}

                {/* 에러 */}
                {error && (
                  <div className="error-box">
                    오류가 발생했어요: {error}<br />잠시 후 다시 시도해 주세요.
                  </div>
                )}

                {/* 결과 */}
                {result && (
                  <div className="results">
                    {/* 강조 박스 */}
                    <div className="answer-box">
                      <div className="answer-label">✦ 이렇게 말하세요</div>
                      <div className="answer-text">{result.corrected}</div>
                      <div className="answer-line">{result.hiragana}</div>
                      <div className="answer-line">{result.koreanPron}</div>
                      {result.koreanTranslation && (
                        <div className="answer-translation">{result.koreanTranslation}</div>
                      )}
                      <div className="speak-row" style={{ justifyContent: 'center', marginTop: 12 }}>
                        <SpeakBtn text={result.corrected} label="🔊 발음 듣기" />
                      </div>
                    </div>

                    {/* 교정 결과 */}
                    <div className="pixel-card">
                      <div className="section-title">
                        <h2>교정 결과</h2>
                        <span className="muted">{result.status}</span>
                      </div>
                      <div className="result-head">
                        <div className="result-box">
                          <div className="label">정답 표현</div>
                          <div className="value">{result.corrected}</div>
                          <div className="speak-row"><SpeakBtn text={result.corrected} label="🔊 문장 듣기" /></div>
                        </div>
                        <div className="result-box">
                          <div className="label">히라가나</div>
                          <div className="value sm">{result.hiragana}</div>
                        </div>
                        <div className="result-box">
                          <div className="label">한국 발음</div>
                          <div className="value sm">{result.koreanPron}</div>
                        </div>
                      </div>
                    </div>

                    {/* 교정 요약 */}
                    {result.summary?.length > 0 && (
                      <div className="pixel-card">
                        <div className="section-title"><h2>한 줄 교정 요약</h2></div>
                        {result.summary.map((s, i) => (
                          <div key={i} className="muted" style={{ padding: '6px 0', borderBottom: '1px dashed rgba(47,44,40,.2)', lineHeight: 1.7 }}>
                            {s}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 시험 태그 (상단 가로) */}
                    {result.examTags?.length > 0 && (
                      <div className="pixel-card" style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#888', marginRight: 4 }}>JLPT · 빈출</span>
                          {result.examTags.map((t, i) => <Chip key={i} text={t} />)}
                        </div>
                      </div>
                    )}

                    {/* 문법 + 단어 */}
                    <div className="grid-2">
                      <div className="pixel-card">
                        <div className="section-title"><h2>핵심 문법</h2><span className="muted">뼈대</span></div>
                        {result.grammarPoints?.length ? result.grammarPoints.map((g, i) => (
                          <div className="grammar-item" key={i}>
                            <div className="grammar-title">
                              {g.title} <span className="chip grammar">{g.level}</span>
                            </div>
                            <div className="grammar-desc">{g.desc}</div>
                          </div>
                        )) : <div className="empty">문법 포인트 없음</div>}
                      </div>

                      <div className="pixel-card">
                        <div className="section-title"><h2>단어별 쪼개기</h2><span className="muted">왜 이렇게?</span></div>
                        <TokenList tokens={result.tokens} maxVisible={result.grammarPoints?.length || 3} />
                      </div>
                    </div>

                    {/* 비슷한 / 상황별 */}
                    <div className="grid-2">
                      <div className="pixel-card">
                        <div className="section-title"><h2>비슷한 표현</h2><span className="muted">눌러서 쪼개보기</span></div>
                        {result.similar?.length
                          ? result.similar.map((item, i) => <ExprItem key={i} item={item} categoryLabel="비슷한 말" />)
                          : <div className="empty">비슷한 표현 없음</div>}
                      </div>
                      <div className="pixel-card">
                        <div className="section-title"><h2>상황별 표현</h2><span className="muted">식당 / 친구 / 정중</span></div>
                        {result.situational?.length
                          ? result.situational.map((item, i) => <ExprItem key={i} item={item} categoryLabel={item.label} />)
                          : <div className="empty">상황별 표현 없음</div>}
                      </div>
                    </div>

                    {/* 미니 대화 */}
                    {result.dialogues?.length > 0 && (
                      <div className="pixel-card">
                        <div className="section-title"><h2>미니 대화</h2><span className="muted">실전 사용 상황</span></div>
                        {result.dialogues.map((dl, i) => <DialogueItem key={i} dialogue={dl} />)}
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>


      </div>

      <div className={`toast${showToast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}
