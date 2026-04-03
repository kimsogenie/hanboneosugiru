import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

const SAMPLES = [
  '스미마센 이거 얼마예요',
  '메뉴 미세테 주세요',
  '오스스메 뭐예요',
  '이거 하나 쿠다사이',
  '오이시이 진짜 맛있다',
  '오카와리 해도 돼요',
  '테이크아웃 데키마스까',
  '카드 쓸 수 있어요',
  '레시트 쿠다사이',
  '예약 하고 싶어요',
  '낭메이 데스까',
  '세키 아리마스까',
  '이거 카라이 데스까',
  '알레르기 아리마스',
  '미즈 쿠다사이',
  '오히야 쿠다사이',
  '이거 나니 데스까',
  '세트로 오네가이시마스',
  '큰 사이즈 아리마스까',
  '후쿠로 쿠다사이',
  '피팅룸 도코 데스까',
  '다른 색깔 아리마스까',
  '디스카운트 아리마스까',
  '코우칸 하고 싶어요',
  '쓰쯔미 쿠다사이',
  '테이블 석 아리마스까',
  '카운터 석 오네가이시마스',
  '킨엔 석 오네가이시마스',
  '창가 자리 아리마스까',
  '히토리 데스',
  '후타리 데스',
  '런치 세트 아리마스까',
  '오늘의 정식 뭐예요',
  '나중에 디저트 오네가이시마스',
  '커피 오카와리 데키마스까',
  '아이스로 쿠다사이',
  '핫으로 오네가이시마스',
  '설탕 없이 오네가이시마스',
  '우유 빼고 오네가이시마스',
  '모치카에리 데스',
  '텐나이 데스',
  '스푼 쿠다사이',
  '나이프 쿠다사이',
  '냅킨 추가 데키마스까',
  '주문 이이 데스까',
  '이거 빼고 오네가이시마스',
  '야사이 빼고 오네가이시마스',
  '안 맵게 오네가이시마스',
  '면 곱빼기 데키마스까',
  '반숙으로 오네가이시마스',
  '와사비 누키로 오네가이시마스',
  '샐러드 추가 오네가이시마스',
  '이거 글루텐 아리마스까',
  '베지터리안 메뉴 아리마스까',
  '키즈 메뉴 아리마스까',
  '세금 포함이에요',
  '서비스 차지 벳베츠 데스까',
  '가격표 미세테 주세요',
  '이거 품절이에요',
  '재고 아리마스까',
  '주문 취소 데키마스까',
  '인기 메뉴 뭐예요',
  '신메뉴 아리마스까',
  '한테이 메뉴 아리마스까',
  '계절 메뉴 아리마스까',
  '배달 데키마스까',
  '현금만 데스까',
  '거스름돈 아리마스까',
  '영수증 두 장 오네가이시마스',
  '영수증 이라나이 데스',
  '선물 포장 오네가이시마스',
  '리본 쪽 데키마스까',
  '쇼핑백 오네가이시마스',
  '이 상품 어디 있어요',
  '신상 아리마스까',
  '세일 언제예요',
  '포인트 츠카에마스까',
  '멤버십 만들고 싶어요',
  '반품 데키마스까',
  '환불 오네가이시마스',
  '영수증 없어도 돼요',
  '이거 시착 데키마스까',
  '다른 사이즈 아리마스까',
  '이거 세탁 가능 데스까',
  '소재 나니 데스까',
  '재입고 언제예요',
  '와이파이 아리마스까',
  '콘센트 아리마스까',
  '충전기 카시테 주세요',
  '오테아라이 도코 데스까',
  '영업시간 난지 마데 데스까',
  '예약 없이 들어갈 수 있어요',
  '웨이팅 아리마스까',
  '얼마나 마치마스까',
  '쿠폰 쓸 수 있어요',
  '스탬프 카드 아리마스까',
  '무료 리필 데키마스까',
  '오이시소우 데스네',
  '이거 오오메 쿠다사이',
  '이거 스쿠나메 오네가이시마스',
  '고치소사마 데시타',
  '이타다키마스',
  '오마카세 오네가이시마스',
  '이거 나마 데스까',
  '웰던으로 오네가이시마스',
  '미디엄으로 오네가이시마스',
  '소스 벳베츠로 쿠다사이',
  '이거 세트로 하면 얼마예요',
  '드링크 오카와리 데키마스까',
  '오늘 특선 뭐예요',
  '타임 한테이 아리마스까',
  '런치는 몇 시까지예요',
  '디너는 몇 시부터예요',
  '이거 辛くない 데스까',
  '이거 아마이 데스까',
  '나 나마모노 못 먹어요',
  '생선 타베라레나이 데스',
  '조금만 스쿠나메 오네가이시마스',
  '이거 주문하고 싶어요',
  '이거 두 개 오네가이시마스',
  'エキ 도코 데스까',
  '치카테츠 어디서 타요',
  '이 덴샤 신주쿠 가요',
  '카타미치 쿠다사이',
  '오우후쿠 얼마예요',
  '막차 난지 데스까',
  '택시 불러주세요',
  '호텔 첵쿠인 하고 싶어요',
  '첵쿠아웃 난지 데스까',
  '니모츠 아즈케테 주세요',
  '관광지 어떻게 가요',
  '버스 몇 번 타요',
  '이 근처 컨비니 아리마스까',
  '공항 어떻게 가요',
  '멘제이텐 도코 데스까',
  '환전하고 싶어요',
  '와이파이 파스워드 오시에테 주세요',
  '헤야 업그레이드 데키마스까',
  '다부루룸 오네가이시마스',
  '트윈룸 아리마스까',
  '킨엔룸 오네가이시마스',
  '뷰 좋은 방 아리마스까',
  '타오루 추가 오네가이시마스',
  '아메니티 아리마스까',
  '아사쇼쿠 포함이에요',
  '조식 난지 데스까',
  '룸서비스 데키마스까',
  '세탁 서비스 아리마스까',
  '주차장 아리마스까',
  '여권 미세테 주세요',
  '크레딧 카드 쓸 수 있어요',
  '레이트 첵쿠인 데키마스까',
  '얼리 첵쿠인 데키마스까',
  '레이트 첵쿠아웃 데키마스까',
  '버스 스톱 도코 데스까',
  '이 주소로 이테 주세요',
  '얼마나 카카리마스까',
  '여기서 오리테 주세요',
  '거스름돈 됐어요',
  '신칸센 타고 싶어요',
  '시테이세키 오네가이시마스',
  '자유석 아리마스까',
  '마도가와 석 오네가이시마스',
  '이 렛샤 난지에 데마스까',
  '노리카에 도코 데스까',
  '몇 정거장이에요',
  '이 킵뿌 아테마스까',
  'IC카드 쓸 수 있어요',
  '코인로커 도코 데스까',
  '분실물 센터 도코 데스까',
  '사이후 나쿠시마시타',
  '파스포토 나쿠시마시타',
  '스마호 나쿠시마시타',
  '케이사츠 욘데 주세요',
  '큐우큐우샤 욘데 주세요',
  '뵤인 도코 데스까',
  '쿠스리야 도코 데스까',
  '칸코우 안나이죠 도코 데스까',
  '지도 쿠다사이',
  '오스스메 칸코우치 어디예요',
  '뉴우죠우료 얼마예요',
  '학생 할인 아리마스까',
  '사진 토테도 이이 데스까',
  '같이 사진 찍어도 될까요',
  '이 근처 오이시이 가게 오시에테 주세요',
  '아루이테 이케마스까',
  '이 미치 아테마스까',
  '도치라 방향이에요',
  '맛스구 데스까',
  '히다리 데스까',
  '미기 데스까',
  '치카이 데스까',
  '토이 데스까',
  '아루이테 난분이에요',
  '공항까지 얼마나 카카리마스까',
  '히코우키 난지 데스까',
  '토우죠우구치 도코 데스까',
  '슛코쿠 심사 어디예요',
  '세이리켄 도코 데스까',
  '멘제이 한도 얼마예요',
  '기내 반입 데키마스까',
  '히코우키 딜레이 됐어요',
  '빈 자리 아리마스까',
  '쓰우로가와 세키 오네가이시마스',
  '마도가와 세키 아리마스까',
  '모우후 쿠다사이',
  '이어폰 쿠다사이',
  '히코우키 요이가 해요',
  '쿠스리 아리마스까',
  '아타마 이타이 데스',
  '오나카 이타이 데스',
  '네츠 아리마스',
  '카제 히이타 카모 시레나이',
  '뵤인 쇼우카이 오네가이시마스',
  '에이고 데키루 센세이 아리마스까',
  '료코우 호켄 아리마스',
  '호켄 쓸 수 있어요',
  '렌타카 하고 싶어요',
  '코우소쿠 버스 아리마스까',
  '야코우 버스 타고 싶어요',
  '페리 아리마스까',
  '스이죠 버스 아리마스까',
  '자전거 렌탈 아리마스까',
  '국제 면허증 있어요',
  '가솔린 스탠도 도코 데스까',
  '만탄 오네가이시마스',
  '주차 데키마스까',
  '주차장 유료 데스까',
  '우미 미에루 헤야 아리마스까',
  '야마 미에루 헤야 아리마스까',
  '料金 포함이에요',
  '조식 포함으로 오네가이시마스',
  '에쿠스토라 벳도 추가 데키마스까',
  '아이 함께 묵을 수 있어요',
  '펫 오케이 데스까',
  '흡연 가능한 방 아리마스까',
  '旅館 예약하고 싶어요',
  '유카타 아리마스까',
  '노천탕 아리마스까',
  '온천 어떻게 가요',
  '체크아웃 후에 짐 맡아줄 수 있어요',
  '와타시 배 고파요',
  '나 오늘 피곤데스',
  '같이 이코우',
  '이마 도코',
  '나중에 렌락 해줘',
  '진짜 무즈카시이',
  '이이 텐키 데스네',
  '오늘 나니 스루',
  '히마 데스까',
  '밥 같이 타베요',
  '마테 마테',
  '비쿠리 했어',
  '와카라나이',
  '시테이마스',
  '츠마라나이',
  '오모시로이 데스네',
  '이키타이 데스',
  '타베타이 데스',
  '네타이 데스',
  '야스미타이 데스',
  '비가 후루네요',
  '사무이 데스',
  '아쯔이 데스',
  '카제 츠요이 데스네',
  '카사 아리마스까',
  '오늘 에이가 미루',
  '카라오케 이코우',
  '컨비니 요루요',
  '비루 놈이마쇼',
  '이자카야 이코우',
  '아시타 도우 데스까',
  '슈우마츠에 아이마쇼',
  '난지가 이이 데스까',
  '나 조금 오쿠레루 것 같아요',
  '마테 주세요',
  '모우 스구 도착해요',
  '이마 이키마스',
  '도코에서 아이마스까',
  '에키 마에에서 아이마쇼',
  '와카리마시타',
  '와스레마시타',
  '고멘나사이',
  '다이죠부 데스',
  '타스카리마시타',
  '아리가토 고자이마스',
  '도이타시마시테',
  '요로시쿠 오네가이',
  '마타 아이마쇼',
  '히사시부리 데스네',
  '오겐키 데스따',
  '이마이치 데스',
  '이이 데스네',
  '이야 데스',
  '코와이 데스',
  '카와이이 데스네',
  '카쿠이이 데스네',
  '오나카 잇파이 데스',
  '노도 카와이타',
  '네무이 데스',
  '츠카레마시타',
  '간바테 쿠다사이',
  '요캇따 데스',
  '잔넨 데스네',
  '시카타 나이 데스네',
  '간바리마스',
  '하야쿠 오키나이토',
  '알람 세팅해야 해요',
  '난지에 네루 데스까',
  '나 하야네 데스',
  '나 오소네 데스',
  '오늘 피곤해서 집에 있을게요',
  '데카케루노 이야 데스',
  '넷플릭스 미루',
  '유튜브 미루',
  '게이무 스루',
  '혼 요무',
  '운도 시마스',
  '산포 이키마스',
  '카페에서 벤쿄우 시마스',
  '토모다치 아우',
  '히토리 고항 타베루',
  '료우리 야테미루',
  '요즘 후토리마시타',
  '다이엣토 하고 싶어요',
  '켄코우에 키오 쓰케나이토',
  '짐에 카요우',
  '요가 야테미요우까',
  '스이에이 나라이타이',
  '슈미 나니 데스까',
  '음악 키쿠노 스키',
  '에이가 미루노 스키 데스',
  '타비 스키 데스',
  '료우리 우마이',
  '에 카쿠노 스키',
  '사신 토루노 스키',
  '게이무 스키 데스',
  '독쇼 스키 데스',
  '스포츠 스키 데스',
  '니혼고 벤쿄우 시테이마스',
  '마이니치 스코시 벤쿄우 시마스',
  '니혼 이키타이 데스',
  '니혼고 죠우즈 니 나리타이',
  '카이와 렌슈우 시타이',
  '니혼진 토모다치 쓰쿠리타이',
  '니혼 도라마 미테이마스',
  '아니메 스키 데스',
  '만가 요미마스',
  '아이도루 스키 데스',
  '콘사토 이키타이',
  '굿즈 카이타이',
  '한테이 아리마스까',
  '우리키레 데스까',
  '팡 데스',
  '사인 모라이타이',
  '혼토우니 스키 데스',
  '오타노시미니 시테이마스',
  '도쿄 이키타이 데스',
  '오오사카 도우 데스까',
  '나 일본어 공부 시작했어요',
  '오늘 날씨 어때요 텐키 도우',
  '우리 집 근처에 이이 카페 아리마스',
  '같이 산포 이코우',
  '카이기 난지 데스까',
  '시료우 오쿠테 주세요',
  '카쿠닌 오네가이시마스',
  '탄토우샤 다레 데스까',
  '미팅 요약하고 싶어요',
  '메이시 코우칸 시마쇼',
  '호우코쿠쇼 테이슈츠 이츠 데스까',
  '오쓰카레사마 데시타',
  '요로시쿠 오네가이시마스',
  '렌락 드리겠습니다',
  '메이루 오쿠리마시타',
  '카쿠닌 오네가이시마스',
  '슈우세이 오네가이시마스',
  '쇼우닌 오네가이시마스',
  '케이야쿠쇼 미세테 주세요',
  '사인 오네가이시마스',
  '하이코우 오네가이시마스',
  '서류 준비됐어요',
  '테이슈츠 데키마시타',
  '시메키리 이츠 데스까',
  '스코시 엔쵸우 데키마스까',
  '이소가시이 데스',
  '요유가 나이 데스',
  '나중에 다시 렌락 드릴게요',
  '켄토우 시마스',
  '죠우시에게 확인해볼게요',
  '요산 이쿠라 데스까',
  '미츠모리쇼 오쿠테 주세요',
  '인보이스 오네가이시마스',
  '레시토 히쓰요우 데스',
  '케이히 세이큐우 데키마스까',
  '슛쵸우 이키마스',
  '슛쵸우 기간 이쿠라 데스까',
  '슛쵸우비 이쿠라 마데 데스까',
  '코우쓰우히 세이큐우 데키마스까',
  '리모토 워크 데키마스까',
  '후렉시부루 쥐쿄우 아리마스까',
  '큐우카 쓸 수 있어요',
  '한큐우 가능 데스까',
  '오늘 야스미 데스까',
  '줌으로 미팅 데키마스까',
  '화면 공유 오네가이시마스',
  '코에 키코에나이 데스',
  '가멘 미에나이 데스',
  '세츠조쿠 킷레마시타',
  '다시 접속해 주세요',
  '파스와도 리셋 오네가이시마스',
  '시스테무 에라 아리마스',
  '프린타 코쇼우 데스',
  '코피기 쓸 수 있어요',
  '스캔 오네가이시마스',
  '파이루 오쿠테 주세요',
  '사이즈 줄여서 오쿠테 주세요',
  'PDF로 헨칸 오네가이시마스',
  '에쿠세루 파이루 아리마스까',
  '파와폰 만들어야 해요',
  '시료우 세이리 오네가이시마스',
  '데이터 카쿠닌 오네가이시마스',
  '분석 야라나이토',
  '호우코쿠쇼 작성 중이에요',
  '하표 준비 중이에요',
  '핏도바쿠 쿠다사이',
  '슈우세이 지코우 아리마스',
  '모우 이치도 켄토우 오네가이시마스',
  '사이슈우 버전 카쿠닌 오네가이시마스',
  '크라이언트 미팅 아리마스',
  '코캬쿠 타이오우 오네가이시마스',
  '쿠레이무 아리마스',
  '샤자이 메이루 오쿠라나이토',
  '타이오우 호우신 세워야 해요',
  '팀장에게 호우코쿠 해야 해요',
  '세략 카이기 아리마스',
  '브레인스토밍 시마쇼',
  '아이디어 아리마스',
  '테이안 드리고 싶어요',
  '기획서 만들고 있어요',
  '프로젝트 진척 어때요',
  '시메키리 마니아이마스까',
  '모우 스코시 지칸 히쓰요우 데스',
  '쿄우료쿠 오네가이시마스',
  '같이 작업해요',
  '야쿠와리 분탄 시마쇼',
  '진척 상황 공유해줘요',
  '슈칸 호우코쿠 해야 해요',
  '겟칸 리포토 준비 중이에요',
  '수치 카쿠닌 오네가이시마스',
  '모쿠효우 타쓰세이 데스',
  '세이세키 이이 데스',
  '다음 분기 목표 어때요',
  'KPI 정해야 해요',
  '스케쥬루 쵸우세이 오네가이시마스',
  '스케쥬루 헨코우 데스',
  '캰세루 데스',
  '리스케쥬루 오네가이시마스',
  '산카 데키마스까',
  '후산 고멘나사이',
  '다이신 산카 시테 쿠다사이마스까',
  '기록 오쿠리마스',
  '액션 아이템 정리했어요',
  '다음 미팅 이츠 데스까',
  '정기 미팅 만들어요',
  '그룹 챗 추가해줘요',
  '슬랙 카쿠닌 오네가이시마스',
  '메세지 오쿠리마시타',
  '쿄우유 폴더 아리마스까',
  '어쿠세스 켄겐 주세요',
  '링크 쿄우유 시마스',
  '드라이브에 업로드 시마시타',
  '다운로드 오네가이시마스',
  '사이신 버전 도코 아리마스까',
  '박쿠아푸 시마시타',
  '사바 다운 데스',
  '긴큐우 타이오우 히쓰요우 데스',
  '에스칼레이션 시나이토',
  '유우센 도 아게마스',
  '쿄우 쥬우니 오네가이시마스',
  '나루베쿠 하야쿠 오네가이시마스',
  '도우조 요로시쿠 오네가이시마스',
  '오세와니 나리마스',
  '앞으로 잘 부탁드립니다 요로시쿠',
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

function ResultBlock({ result }) {
  return (
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

      {/* 시험 태그 */}
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

  // 랜덤 학습 상태
  const [randomSentence, setRandomSentence] = useState('');
  const [randomLoading, setRandomLoading] = useState(false);
  const [randomResult, setRandomResult] = useState(null);
  const [randomError, setRandomError] = useState('');
  const randomResultRef = useRef(null);

  useEffect(() => {
    // 초기 랜덤 문장 세팅
    setRandomSentence(SAMPLES[Math.floor(Math.random() * SAMPLES.length)]);

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

  const callApi = async (txt) => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: txt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `서버 오류 ${res.status}`);
    return data;
  };

  const analyze = async () => {
    const txt = input.trim();
    if (!txt) { showToastMsg('문장을 입력해 주세요.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await callApi(txt);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 랜덤 문장 교체 (API 호출 없이 문장만 바꿈)
  const shuffleRandom = () => {
    const current = randomSentence;
    const pool = SAMPLES.filter((s) => s !== current);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setRandomSentence(next);
    setRandomResult(null);
    setRandomError('');
  };

  // 랜덤 문장으로 학습 시작
  const analyzeRandom = async () => {
    if (!randomSentence) return;
    setRandomLoading(true);
    setRandomError('');
    setRandomResult(null);
    try {
      const data = await callApi(randomSentence);
      setRandomResult(data);
      // 결과 영역으로 스크롤
      setTimeout(() => {
        randomResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (e) {
      setRandomError(e.message);
    } finally {
      setRandomLoading(false);
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

                {/* ✦ 랜덤 학습 섹션 */}
                <section className="pixel-card" style={{ background: 'linear-gradient(135deg, #f5f0e8 0%, #eef5e8 100%)', border: '2px solid #c8d8b0' }}>
                  <div className="section-title">
                    <h2>🎲 입력할 단어가 없으신가요?</h2>
                    <span className="muted">랜덤 한본어로 바로 학습</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#666', marginBottom: 14, lineHeight: 1.6 }}>
                    버튼 하나로 랜덤 한본어 문장이 나와요. 그냥 눌러보세요!
                  </p>

                  {/* 랜덤 문장 카드 */}
                  <div style={{
                    background: '#fff',
                    border: '2px dashed #b8d9a0',
                    borderRadius: 12,
                    padding: '18px 20px',
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#999', marginBottom: 4, fontWeight: 600, letterSpacing: 1 }}>오늘의 한본어</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#2f2c28', letterSpacing: 0.5 }}>
                        {randomSentence}
                      </div>
                    </div>
                    <button
                      className="tertiary"
                      onClick={shuffleRandom}
                      style={{ flexShrink: 0, fontSize: 13 }}
                      disabled={randomLoading}
                    >
                      🔀 다른 문장
                    </button>
                  </div>

                  <button
                    className="primary"
                    onClick={analyzeRandom}
                    disabled={randomLoading}
                    style={{ width: '100%' }}
                  >
                    {randomLoading ? '분석 중...' : '✦ 이 문장으로 학습하기'}
                  </button>

                  {/* 랜덤 로딩 */}
                  {randomLoading && (
                    <div className="pixel-card loading-wrap" style={{ marginTop: 16 }}>
                      <div className="muted">분석 중이에요...</div>
                      <div className="loading-dots">
                        <span /><span /><span />
                      </div>
                    </div>
                  )}

                  {/* 랜덤 에러 */}
                  {randomError && (
                    <div className="error-box" style={{ marginTop: 12 }}>
                      오류가 발생했어요: {randomError}
                    </div>
                  )}

                  {/* 랜덤 결과 */}
                  {randomResult && (
                    <div ref={randomResultRef} style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 600 }}>
                        📌 "{randomSentence}" 교정 결과
                      </div>
                      <ResultBlock result={randomResult} />
                    </div>
                  )}
                </section>

                {/* 직접 입력 섹션 */}
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

                {/* 직접 입력 결과 */}
                {result && <ResultBlock result={result} />}

                {/* 푸터 */}
                <footer style={{
                  marginTop: 40,
                  paddingTop: 16,
                  borderTop: '1px dashed rgba(47,44,40,0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  <span style={{ fontSize: 12, color: '#aaa' }}>한본어스기루 AI</span>
                  <span style={{
                    fontSize: 11,
                    color: '#bbb',
                    background: '#f4f2ee',
                    border: '1px solid #e0dbd4',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontFamily: 'monospace',
                    letterSpacing: 0.5,
                  }}>v0.13</span>
                </footer>
              </main>
            </div>
          </div>
        </div>
      </div>

      <div className={`toast${showToast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}
