import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   인라인 SVG 아이콘 시스템 (lucide-react 미사용)
   24x24 viewBox, 스트로크 기반, 2px 스트로크
   ───────────────────────────────────────────── */
const ICON_PATHS = {
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  brain: "M9.5 2a3.5 3.5 0 0 0-3 5.1A3.5 3.5 0 0 0 5 10.5 3.5 3.5 0 0 0 6 14a3.5 3.5 0 0 0 2.8 4A3.5 3.5 0 0 0 12 21a3.5 3.5 0 0 0 3.2-3 3.5 3.5 0 0 0 2.8-4 3.5 3.5 0 0 0 1-3.5 3.5 3.5 0 0 0-1.5-3.4A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 9.5 2zM12 3.5v17.5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  folderOpen: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM2 10h20",
  settings: "M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  settingsGear: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  bot: "M12 8V4H8M8 2h8M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM9 16h.01M15 16h.01",
  penTool: "M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.586 7.586M11 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  checkCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4",
  sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  imagePlus: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M21 15l-5-5L5 21",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  panelsTopLeft: "M3 3h18a0 0 0 0 1 0 0v18a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0V3zM3 9h18M9 21V9",
  workflow: "M3 3h4v4H3zM17 3h4v4h-4zM10 17h4v4h-4zM5 7v3a4 4 0 0 0 4 4h2M19 7v3a4 4 0 0 1-4 4h-2",
  laptop: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9M2 20h20M12 16v4",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  compass: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  refreshCcw: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  link2: "M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  table2: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  layoutGrid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  school: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  share2: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  chevronDown: "M6 9l6 6 6-6",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 2l10 6.5v7L12 22 2 15.5v-7zM2 8.5l10 6.5 10-6.5M12 22V15",
  messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
};

function Ico({ name, className = "", style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   폰트 + 전역 스타일
   ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Fraunces', Georgia, serif; }
    .ff-body { font-family: 'DM Sans', system-ui, sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }
    * { font-family: 'DM Sans', system-ui, sans-serif; }
    .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─────────────────────────────────────────────
   색상
   ───────────────────────────────────────────── */
const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

/* ─────────────────────────────────────────────
   데이터
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "2026년 3월 12일";
const LEVELS = [
  { key: "all", label: "전체" }, { key: "foundation", label: "기초" },
  { key: "core", label: "핵심" }, { key: "power", label: "고급 기능" }, { key: "expert", label: "전문가" },
];

const CORE_FEATURES = [
  { title: "검색", ico: "globe", color: "#0284c7", description: "현재 사실, 가격, 뉴스, 법규처럼 계속 바뀌는 정보를 실시간 웹 결과로 확인합니다.", when: "모델 학습 시점 이후에 바뀌었을 가능성이 있는 모든 정보." },
  { title: "딥 리서치", ico: "search", color: "#4f46e5", description: "웹 소스, 파일, 연결된 앱을 바탕으로 여러 단계를 거쳐 문서화된 조사를 수행합니다.", when: "빠른 답이 아니라 출처가 있는 보고서가 필요할 때." },
  { title: "프로젝트", ico: "folderOpen", color: "#059669", description: "공유 파일, 맞춤 지침, 대화 기억을 유지하는 지속형 작업 공간입니다.", when: "수업, 고객 업무, 스타트업처럼 다시 돌아올 작업." },
  { title: "메모리", ico: "database", color: "#d97706", description: "대화 전반에서 오래 유지되는 선호와 반복 맥락을 저장합니다.", when: "정확한 문서 저장이 아니라 선호와 패턴을 남길 때." },
  { title: "맞춤 지침", ico: "settingsGear", color: "#57534e", description: "톤, 형식, 답변 구조를 항상 동일하게 유지하도록 하는 기본 규칙입니다.", when: "모든 채팅이 기본적으로 내 규칙을 따르길 원할 때." },
  { title: "캔버스", ico: "panelsTopLeft", color: "#334155", description: "글쓰기와 코드를 눈에 보이는 작업 화면에서 부분 수정 중심으로 다듬을 수 있습니다.", when: "긴 글이나 코드를 반복적으로 수정할 때." },
  { title: "작업", ico: "clock", color: "#7c3aed", description: "나중에 실행될 결과물을 예약하고 알림을 받을 수 있습니다.", when: "리마인더, 일일 브리핑, 반복 요약이 필요할 때." },
  { title: "앱(커넥터)", ico: "wrench", color: "#0d9488", description: "외부 도구를 연결해 ChatGPT가 내 데이터에 접근하고 작업할 수 있게 합니다.", when: "가장 중요한 맥락이 채팅 밖에 있을 때." },
  { title: "에이전트", ico: "workflow", color: "#16a34a", description: "브라우저, 파일, 코드, 연결된 앱을 넘나들며 여러 단계를 자율적으로 수행합니다.", when: "사이트와 동작을 오가는 다단계 작업이 필요할 때." },
  { title: "커스텀 GPT", ico: "bot", color: "#44403c", description: "안정적인 지침과 지식 파일을 담아 반복해서 쓸 수 있는 맞춤형 도우미입니다.", when: "반복되는 작업 흐름을 하나의 시스템으로 만들고 싶을 때." },
  { title: "음성", ico: "mic", color: "#e11d48", description: "말로 상호작용하며 마찰 없이 생각을 정리하고 탐색할 수 있습니다.", when: "소리 내어 생각하거나 동시에 다른 일을 해야 할 때." },
  { title: "이미지", ico: "imagePlus", color: "#c026d3", description: "업로드한 이미지를 분석하고, 설명으로 생성하고, 직접 편집할 수 있습니다.", when: "시각 자료를 이해하거나 만들거나 다듬고 싶을 때." },
  { title: "파일 및 데이터", ico: "fileText", color: "#0891b2", description: "PDF, 스프레드시트, 문서를 업로드해 코드 실행과 함께 분석할 수 있습니다.", when: "차트, 요약, 계산이 필요할 때." },
  { title: "모델", ico: "brain", color: "#65a30d", description: "속도 중심, 균형형, 깊은 추론형 등 작업에 맞는 모드를 선택합니다.", when: "작업 복잡도에 맞춰 성능을 배분할 때." },
];

const ADDITIONAL_FEATURES = [
  { title: "학습 모드", ico: "school", color: "#059669", description: "질문과 이해도 점검을 포함한 안내형 학습을 제공합니다." },
  { title: "녹음", ico: "headphones", color: "#0284c7", description: "회의 내용을 음성으로 기록한 뒤 요약을 만들 수 있습니다." },
  { title: "그룹 채팅", ico: "users", color: "#7c3aed", description: "다른 사람을 대화에 초대해 함께 계획을 세울 수 있습니다." },
  { title: "공유 링크", ico: "link2", color: "#57534e", description: "대화를 URL로 공유할 수 있습니다." },
  { title: "이미지 편집", ico: "camera", color: "#c026d3", description: "생성된 이미지의 특정 영역을 선택해 정교하게 수정할 수 있습니다." },
  { title: "인터랙티브 표", ico: "table2", color: "#0891b2", description: "업로드한 데이터를 분석 전에 시각적으로 확인할 수 있습니다." },
  { title: "스킬", ico: "share2", color: "#0d9488", description: "반복 작업을 일관되게 처리하기 위한 재사용형 워크플로입니다." },
  { title: "펄스", ico: "sparkles", color: "#4f46e5", description: "비동기 조사 후 시각 요약을 다시 가져다줍니다." },
];

const TOOL_CHOOSER = [
  { goal: "빠른 답변 또는 초안 작성", tool: "일반 채팅", ico: "messageSquare", reason: "가장 간단하게 시작할 수 있습니다." },
  { goal: "최신 정보 확인", tool: "검색", ico: "globe", reason: "바뀌었을 수 있는 정보에 적합합니다." },
  { goal: "파일이 있는 지속 작업", tool: "프로젝트", ico: "folderOpen", reason: "세션이 바뀌어도 맥락을 유지합니다." },
  { goal: "긴 문서 수정", tool: "캔버스", ico: "panelsTopLeft", reason: "정교한 부분 수정에 더 적합합니다." },
  { goal: "여러 소스를 종합한 보고서", tool: "딥 리서치", ico: "search", reason: "인용과 함께 여러 단계를 거쳐 종합합니다." },
  { goal: "복잡한 온라인 작업", tool: "에이전트", ico: "workflow", reason: "여러 사이트와 동작을 넘나듭니다." },
  { goal: "반복 출력", tool: "작업", ico: "clock", reason: "비동기로 실행되고 알림을 줍니다." },
  { goal: "같은 흐름을 자주 반복", tool: "GPT 또는 스킬", ico: "bot", reason: "패턴을 시스템으로 바꿉니다." },
];

const PROMPT_BLOCKS = [
  { label: "목표", example: "투자자 미팅용 1페이지 프로젝트 브리프를 작성해 줘.", color: "#10a37f" },
  { label: "맥락", example: "이 스타트업은 매출 전 단계의 Series A, 기후 기술 분야야.", color: "#0284c7" },
  { label: "제약 조건", example: "400단어 이하. 전문 용어 금지. 불릿 포인트 금지.", color: "#7c3aed" },
  { label: "형식", example: "문제, 해결책, 성과, 요청 순서로 구성해.", color: "#d97706" },
  { label: "품질 기준", example: "템플릿처럼 쓰지 말고 맥킨지 어소시에이트 수준으로 써.", color: "#e11d48" },
  { label: "검증", example: "출처가 필요한 주장은 따로 표시해.", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"foundation", number:"01", title:"올바른 사고방식부터 잡아라", ico:"brain", color:"#65a30d",
    summary:"ChatGPT를 정답 기계가 아니라 사고 파트너로 다뤄야 합니다. 첫 답변은 최종 진실이 아니라 쓸 만한 초안입니다. 검토하기 전까지는 모든 결과를 잠정안으로 봐야 합니다.",
    whyItMatters:"실망의 대부분은 기대치가 어긋나서 생깁니다. 확실한 정답이 아니라 수준 높은 초안을 기대해야 합니다.",
    beginnerMoves:["첫 답변은 초안이라고 가정하고 비판적으로 읽어라.","어떤 가정을 두었는지 물어라.","판단을 대체시키지 말고, 판단 속도를 높이는 데 써라."],
    advancedMoves:["가장 강한 반론이 무엇인지 물어라.","탐색, 권고, 리스크 검토를 단계별로 나눠라.","중요한 결정에서는 세컨드 오피니언으로 활용해라."],
    commonMistakes:["수치 주장을 검증 없이 믿는 것.","말이 없으면 자신감 있다고 착각하는 것.","결과를 그대로 복붙하는 것."],
    promptExamples:[{prompt:"네가 어떤 가정을 했는지 말해 줘.",why:"숨은 추론을 드러냅니다."},{prompt:"회의적인 전문가라면 무엇을 문제 삼을까?",why:"공격적인 자기 점검을 유도합니다."},{prompt:"네 권고에 대한 가장 강한 반론을 제시해 줘.",why:"확증편향을 줄입니다."},{prompt:"각 주장에 대해 자신감을 1~5점으로 매겨 줘.",why:"사실과 추정을 구분합니다."}],
    beforeAfter:{before:"보스턴에 커피숍 사업계획서 하나 써 줘.",after:"보스턴 다운타운에 낼 스페셜티 커피숍 1페이지 사업계획서를 작성해 줘. 대상은 대학원생과 원격 근무자야. 추정치인 부분은 반드시 표시해 줘.",improvement:"대상, 위치, 맥락, 검증 규칙이 추가됐습니다."},
    visual:"mental" },
  { id:"workspace", level:"foundation", number:"02", title:"프롬프트보다 먼저 작업 공간을 이해하라", ico:"laptop", color:"#059669",
    summary:"지금의 ChatGPT는 층위가 나뉜 작업 공간입니다. 작업마다 맞는 층이 따로 있습니다. 잘못된 층에서 쓴 영리한 프롬프트보다, 맞는 층에서 쓴 평범한 프롬프트가 더 낫습니다.",
    whyItMatters:"한 글자 쓰기 전에 가장 큰 레버리지는 올바른 작업 공간을 고르는 것입니다.",
    beginnerMoves:["가벼운 일회성 작업은 일반 채팅.","다시 볼 작업은 프로젝트.","완전히 새 출발이 필요하면 임시 채팅."],
    advancedMoves:["수업, 고객, 프로젝트마다 하나의 프로젝트를 만들어라.","프로젝트를 장기 지식 허브처럼 써라.","전략은 채팅에서, 반복 수정은 캔버스에서 해라."],
    commonMistakes:["프로젝트로 돌아오지 않고 매번 새 채팅을 여는 것.","긴 문서를 채팅에서만 다루는 것.","작업과 에이전트를 아예 무시하는 것."],
    promptExamples:[{prompt:"이건 채팅, 프로젝트, GPT 중 어디에서 해야 가장 좋을까?",why:"작업 공간부터 고르게 합니다."},{prompt:"내 학기 전체를 위한 이상적인 프로젝트 구조를 짜 줘.",why:"먼저 구조를 설계합니다."},{prompt:"어떤 파일과 지침을 넣어야 할까?",why:"프로젝트 맥락을 최적화합니다."}],
    beforeAfter:{before:"새 채팅을 계속 열다 보니 맥락을 자꾸 잃어버려.",after:"프로젝트를 만들어라. 참고 자료를 업로드해라. 지침을 설정해라. 그리고 같은 프로젝트로 계속 돌아와라.",improvement:"휘발성 채팅이 지속형 작업 공간으로 바뀝니다."},
    visual:"layers" },
  { id:"prompting", level:"foundation", number:"03", title:"프롬프트는 기교보다 명확성이 중요하다", ico:"penTool", color:"#0284c7",
    summary:"좋은 프롬프트는 작전 지시서와 같습니다. 화려한 문장은 선택 사항이지만, 명확한 제약은 필수입니다. 머릿속 기준을 적어 주지 않으면 모델은 알 수 없습니다.",
    whyItMatters:"모호한 프롬프트는 뻔한 결과를 만듭니다. 대부분의 불만은 입력이 지나치게 추상적이어서 생깁니다.",
    beginnerMoves:["대상 독자와 사용 상황을 분명히 써라.","성공 기준이 무엇인지 말해라.","형식, 톤, 분량, 피해야 할 것을 지정해라."],
    advancedMoves:["먼저 개요를 받고 승인한 뒤 본문을 써라.","사실과 해석을 나눠라.","스스로 채점할 평가 기준을 함께 줘라."],
    commonMistakes:["세 단어짜리 프롬프트로 맞춤형 결과를 기대하는 것.","제약을 한꺼번에 너무 많이 거는 것.","부탁하듯 돌려 말하고 직접 지시하지 않는 것."],
    promptExamples:[{prompt:"목표: ___. 맥락: ___. 제약: ___. 결과물: ___.",why:"어디에나 쓰는 기본 골격입니다."},{prompt:"먼저 개요만 제시해. 아직 본문은 쓰지 마.",why:"구조가 틀린 초안을 막아 줍니다."},{prompt:"쓰기 전에 네가 알아야 할 정보를 먼저 말해 줘.",why:"모델이 필요한 정보를 되묻게 합니다."},{prompt:"[역할]이 [청중]에게 설명하듯 작성해 줘.",why:"톤과 깊이를 고정합니다."}],
    beforeAfter:{before:"커버레터 써 줘.",after:"맥킨지 Strategy Analyst 지원용 커버레터를 작성해 줘. 나는 International Management 전공 대학원생이고 SOP와 CRM 경험이 있어. 자신감은 있지만 거만하면 안 돼. 350단어 이내. 'I am passionate about'는 쓰지 마.",improvement:"직무, 배경, 톤, 분량, 금지 표현이 모두 들어갔습니다."},
    visual:"prompt" },
  { id:"revision", level:"core", number:"04", title:"한 번에 완벽하려 하지 말고 수정 흐름을 써라", ico:"refreshCcw", color:"#7c3aed",
    summary:"좋은 활용은 반복입니다. 구조를 잡고, 초안을 만들고, 비판하고, 수정하고, 완성합니다. 많은 사용자는 다듬어야 할 때 처음부터 다시 시작합니다.",
    whyItMatters:"원샷 방식은 첫 시도 수준에서 품질이 멈춥니다. 수정 흐름은 결과를 훨씬 안정적으로 끌어올립니다.",
    beginnerMoves:["초안 다음에는 '무엇이 약하고 무엇이 빠졌는가?'를 물어라.","더 좁은 목표로 다시 다듬어라.","방향이 완전히 틀린 게 아니면 처음부터 다시 쓰지 마라."],
    advancedMoves:["구조, 정확성, 톤, 압축, 마감 포장 순으로 고정 패스를 돌려라.","수정 전에 자기 비판을 먼저 시켜라.","압축 비율을 수치로 지시해라."],
    commonMistakes:["모델이 스스로 진단하게 하지 않고 사람이 수작업으로만 고치는 것.","'더 좋게 해 줘'처럼 막연하게 지시하는 것.","초점 없는 수정을 너무 많이 반복하는 것."],
    promptExamples:[{prompt:"네 답이 왜 목표를 충족하지 못했는지 설명해 줘.",why:"수정 전에 자기 진단을 시킵니다."},{prompt:"논리를 더 날카롭게 다듬어. 구조는 유지해.",why:"수정 범위를 제한합니다."},{prompt:"핵심은 유지한 채 35% 압축해 줘.",why:"우선순위를 강제로 정리하게 합니다."},{prompt:"이 기준으로 채점해 줘. 4/5 미만인 부분은 어디야?",why:"구조화된 자기 평가가 됩니다."}],
    beforeAfter:{before:"이건 아닌데. 다시 해 봐.",after:"2번째 단락의 논리가 순환적이야. 업로드한 보고서의 데이터 포인트 하나를 넣어서 그 부분만 다시 써 줘. 나머지는 유지해.",improvement:"무엇이 문제인지, 무엇을 고칠지, 무엇을 유지할지가 명확합니다."},
    visual:"workflow" },
  { id:"writing", level:"core", number:"05", title:"글쓰기, 재작성, 변환 작업", ico:"fileText", color:"#57534e",
    summary:"ChatGPT는 변환 작업에 특히 강합니다. 독자에 맞게 다시 쓰고, 톤을 바꾸고, 요약하고, 재구성하는 데 유용합니다. 무에서 새로 쓰는 것보다 기존 글을 개선하는 데 더 잘 맞는 경우가 많습니다.",
    whyItMatters:"실무 글쓰기의 대부분은 새로 쓰기보다 변환입니다. AI의 효율이 가장 크게 나는 구간입니다.",
    beginnerMoves:["원문을 붙여 넣고, 무엇을 유지하고 무엇을 바꿀지 말해라.","대상 독자, 채널, 톤을 지정해라.","톤이 애매하면 여러 버전을 받아라."],
    advancedMoves:["공식형, 간결형, 설득형처럼 대비 버전을 만들어라.","문장 단위 진단을 요청해라.","사실은 유지한 채 스타일만 바꾸게 해라."],
    commonMistakes:["이미 메모가 있는데도 처음부터 새로 쓰는 것.","첫 톤 하나만 받고 끝내는 것.","무엇을 유지해야 하는지 지정하지 않는 것."],
    promptExamples:[{prompt:"교수님께 보내는 이메일 톤으로 다시 써 줘. 예의 바르고, 직접적이고, 군더더기 없이.",why:"정확한 변환 지시입니다."},{prompt:"세 가지 버전으로 써 줘. 공식형, 간결형, 설득형.",why:"비교해서 고를 수 있습니다."},{prompt:"어떤 문장이 뻔하게 느껴지고 왜 그런지 짚어 줘.",why:"문장 단위 진단입니다."},{prompt:"사실과 구조는 유지하고 톤만 바꿔 줘.",why:"수정 범위를 좁힙니다."}],
    beforeAfter:{before:"이 이메일 좀 더 좋게 만들어 줘.",after:"프로그램 디렉터에게 보내는 이메일로 다시 써 줘. 예의 바르고 직접적으로. 전문 용어는 빼고. 150단어 이하. 액션 아이템은 유지해.",improvement:"독자, 톤, 금지 요소, 분량, 유지 요소가 분명합니다."},
    visual:"writing" },
  { id:"files-data", level:"core", number:"06", title:"파일, PDF, 스프레드시트, 데이터 다루기", ico:"table2", color:"#0891b2",
    summary:"ChatGPT는 파일을 살펴보고, 문서를 요약하고, 데이터를 코드로 처리하고, 차트를 만들 수 있습니다. 핵심은 먼저 설명하고, 그다음 분석하고, 마지막에 결론 내리는 순서입니다.",
    whyItMatters:"데이터를 해석하기 전에 구조를 먼저 확인하면 가장 흔한 오류를 줄일 수 있습니다.",
    beginnerMoves:["파일이 무엇을 담고 있는지부터 물어라.","필드 점검부터 요청해라.","PDF는 구조, 주장, 근거를 나눠서 보아라."],
    advancedMoves:["어떤 가정을 썼는지 추적 가능하게 요구해라.","표를 추출한 뒤 다시 확인하게 해라.","큰 데이터셋은 코드 실행으로 처리해라."],
    commonMistakes:["곧바로 '핵심 인사이트'부터 묻는 것.","차트 라벨을 검증 없이 믿는 것.","PDF 파싱이 완벽할 거라고 가정하는 것."],
    promptExamples:[{prompt:"필드, 날짜 범위, 결측치, 가능한 분석 방법을 먼저 설명해 줘.",why:"분석 전에 점검하게 합니다."},{prompt:"비판하기 전에 문서의 핵심 논지를 먼저 추출해 줘.",why:"판단 전에 이해를 확인합니다."},{prompt:"이 차트에 사용된 모든 가정을 나열해 줘.",why:"추적 가능한 점검이 됩니다."},{prompt:"이 데이터를 정리하는 Python 코드를 작성하고 실행한 뒤 결과를 보여 줘.",why:"재현 가능한 분석입니다."}],
    beforeAfter:{before:"이 스프레드시트 핵심 인사이트 알려 줘?",after:"먼저 컬럼, 데이터 유형, 날짜 범위, 결측치를 점검해 줘. 그다음 유용도 기준으로 분석 세 가지를 제안해 줘. 내가 승인하기 전에는 실행하지 마.",improvement:"점검, 제안, 승인 절차가 생깁니다."},
    visual:"data" },
  { id:"search-research", level:"core", number:"07", title:"검색, 딥 리서치, 인용의 기본", ico:"search", color:"#4f46e5",
    summary:"최신 정보는 검색으로 확인하고, 다단계 보고서는 딥 리서치로 처리해야 합니다. 현재성, 규제, 변화 속도가 중요한 주제는 정적 기억만으로 답하면 안 됩니다.",
    whyItMatters:"검색 없이 쓰면 ChatGPT는 고정된 시점의 지식만으로 답합니다.",
    beginnerMoves:["바뀌었을 수 있는 정보는 검색해라.","인용 출처가 실제로 그 주장을 뒷받침하는지 확인해라.","중요한 사안은 1차 자료를 우선해라."],
    advancedMoves:["'확인된 사실과 네 추론을 구분해라'라고 요구해라.","출처 종류, 지역, 기간을 지정해라.","딥 리서치 범위를 미리 명확히 정해라."],
    commonMistakes:["최신 이슈를 모델 기억만 믿고 묻는 것.","'출처 있음'이라는 말만 믿고 클릭해 보지 않는 것.","단순 사실 질문에 딥 리서치를 남용하는 것."],
    promptExamples:[{prompt:"검색해 줘. 1차 자료만 사용해.",why:"실시간 자료를 품질 조건과 함께 가져옵니다."},{prompt:"사실과 추론을 구분하고 각각 표시해 줘.",why:"지식의 상태를 투명하게 드러냅니다."},{prompt:"6개월 안에 낡을 수 있는 부분이 뭐야?",why:"시간 민감도를 점검합니다."},{prompt:"딥 리서치: [주제]. 범위: [지역, 날짜].",why:"조사 범위를 명확히 고정합니다."}],
    beforeAfter:{before:"AI 규제 최신 상황 알려 줘?",after:"검색해 줘. 최근 30일 기준 EU와 미국의 AI 규제 상황을 1차 자료 중심으로 정리해 줘. 이미 시행된 것과 제안 단계인 것을 구분해.",improvement:"범위, 기간, 자료 기준, 분류 방식이 분명합니다."},
    visual:"research" },
  { id:"multimodal", level:"core", number:"08", title:"음성, 이미지, 멀티모달 워크플로", ico:"imagePlus", color:"#c026d3",
    summary:"음성 대화, 이미지 이해, 생성, 편집은 이제 기본 기능입니다. 핵심은 구체성입니다. 시각적 요청이 모호하면 결과도 평범해집니다.",
    whyItMatters:"멀티모달을 쓰면 ChatGPT는 시각 분석 도구이자 이미지 스튜디오이고, 손을 덜 쓰는 브레인스토밍 도구가 됩니다.",
    beginnerMoves:["업로드한 이미지로 무엇을 해 달라는지 정확히 말해라.","정교함보다 속도가 중요하면 음성을 써라.","이미지 생성은 피사체, 구도, 분위기, 스타일을 지정해라."],
    advancedMoves:["분석하고, 설명하고, 메모로 정리하는 식으로 모드를 연결해라.","디자인 리뷰에 이미지 비평을 써라.","영역을 지정해 수정 범위를 제한해라."],
    commonMistakes:["이미지만 올리고 지시를 안 하는 것.","모호한 설명으로 사실적인 이미지를 기대하는 것.","음성도 텍스트와 같은 맥락을 공유한다는 점을 잊는 것."],
    promptExamples:[{prompt:"메뉴 항목을 추출해서 카테고리별로 정리해 줘.",why:"구체적인 추출 지시입니다."},{prompt:"이 차트를 비기술 임원에게 120단어 안으로 설명해 줘.",why:"제약 조건이 있는 분석입니다."},{prompt:"세로 9:16 비율, 영화 같은 느낌, 골든아워 톤으로 생성해 줘.",why:"사진 스타일의 명세가 됩니다."},{prompt:"배경을 흰색 스튜디오로 바꿔 줘. 피사체는 유지해.",why:"수정 범위를 제한합니다."}],
    beforeAfter:{before:"멋진 이미지 하나 만들어 줘.",after:"16:9 비율로, 해 질 무렵의 현대적인 도쿄 커피숍을 만들어 줘. 건축 사진 스타일, 얕은 심도, 따뜻한 톤. 원목 카운터, 에스프레소 머신, 도시 불빛 포함. 사람은 없음.",improvement:"비율, 피사체, 스타일, 분위기, 요소, 제외 조건이 모두 들어갔습니다."},
    visual:"multimodal" },
  { id:"study-collab", level:"power", number:"09", title:"학습, 녹음, 그룹, 공유 링크, 스킬", ico:"layoutGrid", color:"#0d9488",
    summary:"학습용 기능, 음성 기록, 협업, 공유, 워크플로 고정화에 쓰는 기능들입니다.",
    whyItMatters:"학습은 단순 답변 받기와 다르고, 협업은 혼자 프롬프트 쓰는 것과 다릅니다.",
    beginnerMoves:["학습할 때는 정답만 받지 말고 학습 모드를 써라.","회의나 강의는 녹음 기능을 써라.","공유 링크와 그룹 채팅으로 협업을 정리해라."],
    advancedMoves:["녹음 요약을 프로젝트의 소스 파일로 쌓아라.","반복 작업은 스킬로 만들어라.","그룹 채팅과 프로젝트를 함께 써서 공동 맥락을 유지해라."],
    commonMistakes:["공부할 때 일반 채팅만 써서 학습 효과를 놓치는 것.","녹음 기능이 있는지조차 모르는 것.","공유 링크 대신 화면 캡처만 쓰는 것."],
    promptExamples:[{prompt:"답을 바로 주지 말고 퀴즈 형식으로 물어봐.",why:"학습 중심 접근으로 바꿉니다."},{prompt:"녹음 내용을 액션 아이템과 후속 이메일 초안으로 바꿔 줘.",why:"하나의 기록을 여러 결과물로 변환합니다."},{prompt:"이 작업 흐름을 스킬로 바꿔 줘.",why:"과정을 공식화할 수 있습니다."}],
    beforeAfter:{before:"광합성 설명해 줘.",after:"생물 시험 공부 중이야. 설명하지 말고, 쉬운 것부터 어려운 것까지 이해도를 확인하는 질문을 해 줘. 틀리면 짧게 교정해 줘.",improvement:"정답 전달이 아니라 안내형 학습으로 바뀝니다."},
    visual:"collab" },
  { id:"personalization", level:"power", number:"10", title:"메모리, 지침, 성격, 임시 채팅의 차이", ico:"database", color:"#d97706",
    summary:"메모리는 맥락을 저장하고, 지침은 규칙을 정하고, 성격은 스타일을 조정하고, 임시 채팅은 완전히 새 작업실을 만듭니다. 이 네 가지는 서로 대체 관계가 아닙니다.",
    whyItMatters:"개인화 설정이 잘못되면 도움이 되기보다 결과 품질을 떨어뜨립니다.",
    beginnerMoves:["메모리는 넓고 오래가는 선호에 써라.","지침은 전역 글쓰기 규칙에 써라.","임시 채팅은 완전 초기화가 필요할 때 써라."],
    advancedMoves:["성격은 질감 조정이지 지침 대체 수단이 아니다.","전역 설정보다 프로젝트별 지침을 우선해라.","메모리를 주기적으로 점검해라."],
    commonMistakes:["모든 걸 지침이 아니라 메모리에 넣는 것.","오래된 메모리를 계속 쌓아 두는 것.","능력 변화까지 성격 설정으로 해결하려는 것."],
    promptExamples:[{prompt:"네가 나에 대해 무엇을 기억하고 있는지 보여 줘.",why:"메모리를 점검할 수 있습니다."},{prompt:"공식적인 톤 선호는 잊어 줘.",why:"특정 메모리만 정리할 수 있습니다."},{prompt:"저장된 선호 없이 완전 새 상태로 진행해.",why:"클린룸 모드가 됩니다."}],
    beforeAfter:{before:"선호를 메모리에 넣어 뒀는데 결과가 들쭉날쭉해.",after:"행동 규칙은 지침에 넣고, 사실은 메모리에 두고, 분야별 규칙은 프로젝트 지침에 넣어라.",improvement:"각 계층의 역할이 분리됩니다."},
    visual:"memory" },
  { id:"projects", level:"power", number:"11", title:"프로젝트를 나만의 운영체제로 써라", ico:"folderOpen", color:"#16a34a",
    summary:"프로젝트를 쓰면 ChatGPT가 맥락을 기억하는 작업대가 됩니다. 제대로 구성한 프로젝트 하나가 단발성 채팅 여러 개보다 훨씬 강합니다.",
    whyItMatters:"여러 세션에 걸친 작업에서는 프로젝트가 가장 레버리지가 큰 정리 도구입니다.",
    beginnerMoves:["작업 흐름마다 프로젝트 하나씩 만들어라. 이름은 분명하게.","관련 있는 파일만 올려라.","프로젝트 지침을 반드시 써라."],
    advancedMoves:["대화 요약을 소스 파일처럼 축적해라.","주간 작업도 새 채팅이 아니라 하나의 프로젝트 안에서 이어가라.","개인 생산성을 위한 메타 프로젝트도 만들 수 있다."],
    commonMistakes:["프로젝트를 지나치게 잘게 쪼개는 것.","관련 없는 파일까지 전부 올려 맥락을 비대하게 만드는 것.","프로젝트 지침을 비워 두는 것."],
    promptExamples:[{prompt:"내 학기 전체에 맞는 이상적인 프로젝트 구조를 설계해 줘.",why:"작업 공간을 먼저 설계합니다."},{prompt:"이전 작업 톤과 맞는 메모를 작성해 줘.",why:"쌓인 맥락을 활용합니다."},{prompt:"최근 다섯 번의 대화에서 중요한 결정만 요약해 줘.",why:"살아 있는 요약 문서가 됩니다."}],
    beforeAfter:{before:"파일이 여기저기 흩어져서 자꾸 놓쳐.",after:"영역별로 프로젝트 하나씩 만들고, 참고 자료와 지침을 넣고, 같은 프로젝트로 계속 돌아와라. 주기적으로 요약도 남겨라.",improvement:"흩어진 대화가 구조화된 작업 체계로 바뀝니다."},
    visual:"project" },
  { id:"gpts", level:"power", number:"12", title:"GPT를 만들어야 할 때와 만들지 말아야 할 때", ico:"bot", color:"#44403c",
    summary:"반복되는 작업이고, 지침이 안정적이며, 재사용 가치가 있을 때 GPT는 유용합니다. 하지만 대부분 너무 일찍 만듭니다.",
    whyItMatters:"흐름이 성숙하기 전에 GPT를 만들면 미완성 작업 방식이 그대로 굳어 버립니다. 반대로 시점이 맞으면 검증된 과정을 원클릭 도구로 바꿀 수 있습니다.",
    beginnerMoves:["먼저 프롬프트를 저장해라. 프롬프트가 시제품이다.","세 번 이상 반복한 뒤에 공식화해라.","목적은 좁게. 한 GPT는 한 가지 일."],
    advancedMoves:["역할, 지침, 지식, 도구의 네 층으로 설계해라.","실패 규칙을 명시해라.","반대 상황까지 포함해 테스트해라."],
    commonMistakes:["한 번 할 작업인데 바로 GPT를 만드는 것.","'모든 걸 다 해 줘'처럼 지나치게 넓게 만드는 것.","지식 파일 없이 만드는 것."],
    promptExamples:[{prompt:"우리가 쓰는 작업 흐름을 GPT 설계안으로 바꿔 줘.",why:"실제 경험에서 사양을 뽑아냅니다."},{prompt:"지침, 입력/출력 스키마, 실패 규칙까지 포함해 줘.",why:"완전한 명세가 됩니다."},{prompt:"이 GPT가 처리해야 할 예외 상황은 뭐야?",why:"견고성을 시험합니다."}],
    beforeAfter:{before:"내 이메일 전부 처리하는 GPT를 만들자.",after:"교수님 답장 전용 GPT를 만들자. 예의 바르고 직접적으로. 150단어 이하. 먼저 맥락을 묻고, 확인 없이는 보내지 않게 해. 업로드 파일: 내 스타일 가이드.",improvement:"범위가 좁아지고, 안전 규칙과 참고 자료가 명확해집니다."},
    visual:"gpt" },
  { id:"canvas", level:"power", number:"13", title:"글쓰기와 코드 수정은 캔버스로", ico:"panelsTopLeft", color:"#334155",
    summary:"채팅 옆에서 문서처럼 보이는 작업 화면입니다. 긴 산출물을 정교하게 고칠 때는 선형 채팅보다 훨씬 낫습니다.",
    whyItMatters:"긴 결과물은 채팅 안에서 다루면 흐트러지기 쉽습니다. 캔버스는 문서 자체를 중심에 놓습니다.",
    beginnerMoves:["긴 결과물은 캔버스로 옮겨라.","파일은 목적별로 나눠라.","막연한 재작성보다 부분 수정 지시를 해라."],
    advancedMoves:["전략은 채팅, 실행은 캔버스로 나눠라.","먼저 구조를 잡고, 그다음 좁은 수정 단위를 적용해라.","버전 기록을 비교에 활용해라."],
    commonMistakes:["긴 문서를 계속 채팅에서만 다루는 것.","한 문단만 고치면 되는데 전체를 다시 쓰는 것.","디버깅에 코드 캔버스를 쓰지 않는 것."],
    promptExamples:[{prompt:"글쓰기 캔버스를 열고, 서론만 다시 써 줘.",why:"수정 범위를 제한합니다."},{prompt:"논리 오류를 찾아서 그 줄만 패치해 줘.",why:"정밀한 코드 수정이 가능합니다."},{prompt:"3절을 2절 앞으로 옮기고, 4절과 5절을 합쳐 줘.",why:"구조 재편에 적합합니다."}],
    beforeAfter:{before:"내 에세이 다시 써 줘. [2000단어를 채팅에 붙여 넣음]",after:"캔버스로 열어 줘. 아직 수정하지 말고, 강한 부분과 약한 부분만 표시해 줘. 그다음 내가 수정 방향을 지시할게.",improvement:"수정 전에 먼저 점검하게 됩니다."},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"expert", number:"14", title:"작업, 앱, 펄스, 에이전트", ico:"workflow", color:"#16a34a",
    summary:"운영 계층입니다. 작업은 나중에 실행되고, 앱은 데이터를 가져오고, 펄스는 비동기로 조사하고, 에이전트는 여러 단계를 자율적으로 처리합니다.",
    whyItMatters:"많은 사용자가 실시간 질의응답에만 머뭅니다. 이 층을 쓰면 ChatGPT가 나 대신 움직이는 시스템이 됩니다.",
    beginnerMoves:["작업은 리마인더, 브리핑, 반복 요약에 써라.","앱은 정보가 Drive, Slack, 이메일 등에 있을 때 연결해라.","에이전트는 사람이 15분 이상 걸릴 다단계 작업에 써라."],
    advancedMoves:["에이전트 프롬프트는 중단 지점을 포함한 업무 지시서처럼 써라.","펄스로 관심 주제를 선제적으로 추적해라.","작업과 프로젝트를 묶어 주간 자동 요약을 만들어라."],
    commonMistakes:["에이전트 기능 자체를 모르는 것.","중단 규칙 없이 모호한 지시만 주는 것.","작업 기능을 리마인더 용도로만 쓰는 것."],
    promptExamples:[{prompt:"매일 오전 8시에 [주제] 상위 3개 브리핑을 보내 줘.",why:"선제적 브리핑이 가능합니다."},{prompt:"연결된 내부 자료와 공개 자료를 함께 써서 경쟁사 분석을 해 줘.",why:"내부와 외부 데이터를 함께 씁니다."},{prompt:"에이전트: 아래 단계대로 진행하고, 제출 직전에 멈춰 줘.",why:"자율 실행과 체크포인트를 함께 둡니다."}],
    beforeAfter:{before:"사이트 다섯 개 들어가서 가격 비교해 줘.",after:"에이전트로 경쟁사 5곳을 방문해 가격을 추출하고 표로 정리해 줘. 로그인 필요하면 멈춰. 오래된 가격이면 표시해.",improvement:"범위, 예외 처리, 중단 규칙이 포함된 위임이 됩니다."},
    visual:"agent" },
  { id:"model-choice", level:"expert", number:"15", title:"모델과 모드 선택", ico:"compass", color:"#65a30d",
    summary:"모드마다 속도, 추론 깊이, 도구 지원이 다릅니다. 작업 성격에 맞게 모델 출력을 맞춰야 합니다.",
    whyItMatters:"항상 가장 강한 모드만 쓰면 시간 낭비고, 끝까지 가벼운 모드만 쓰면 깊이가 부족해집니다.",
    beginnerMoves:["일상 작업은 자동 모드부터.","복잡한 논리나 종합 작업은 더 강한 모드로 올려라.","가장 강하다고 항상 최선은 아니다."],
    advancedMoves:["초안은 빠른 모드, 결정 전 검토는 깊은 모드로 나눠라.","추론 모드의 도구 제한도 확인해라.","가볍게 시작했다가 중간에 올려도 된다."],
    commonMistakes:["모든 작업에 가장 무거운 모델을 쓰는 것.","문제가 모드가 아니라 모델 자체라고만 생각하는 것.","요금제별 접근 범위를 확인하지 않는 것."],
    promptExamples:[{prompt:"먼저 빠르게 답하고, 그다음 한 번 더 깊게 검토해 줘.",why:"속도와 깊이를 둘 다 챙길 수 있습니다."},{prompt:"복잡한 논리 문제야. 단계별로 깊게 추론해 줘.",why:"심화 추론을 명시적으로 요구합니다."},{prompt:"이 작업은 빠른 초안이 나을까, 신중한 추론이 나을까?",why:"모델이 모드 선택을 도와줍니다."}],
    beforeAfter:{before:"항상 가장 고급 모델만 쓰면 되지.",after:"빠른 작업은 자동, 논리 검토는 추론형, 브레인스토밍은 빠른 모드처럼 작업 성격에 맞춰 써라.",improvement:"성능을 작업 유형에 맞게 배분하게 됩니다."},
    visual:"models" },
  { id:"privacy-risk", level:"expert", number:"16", title:"개인정보, 데이터 통제, 리스크 관리", ico:"shield", color:"#e11d48",
    summary:"기능이 강해질수록 경계도 더 분명해야 합니다. 민감한 데이터는 업로드 기준을 세워야 하고, 고위험 출력은 반드시 사람이 검토해야 합니다.",
    whyItMatters:"경계 없는 활용은 데이터 노출이나 과신으로 이어질 수 있습니다.",
    beginnerMoves:["민감한 자료를 습관적으로 올리지 마라.","업로드 전에 식별자를 지워라.","가장 깔끔한 프라이버시가 필요하면 임시 채팅을 써라."],
    advancedMoves:["빨강, 노랑, 초록 식의 업로드 정책을 만들어라.","고위험 판단은 전문가 검토를 거쳐라.","정기적으로 데이터 점검을 해라."],
    commonMistakes:["샘플이면 될 일을 전체 데이터베이스로 올리는 것.","임시 채팅이면 아무 처리도 안 된다고 오해하는 것.","규제 분야에서 AI 출력을 최종 결정처럼 쓰는 것."],
    promptExamples:[{prompt:"이 중 어떤 부분은 인간 전문가 검증이 필요해?",why:"한계를 먼저 표시해 줍니다."},{prompt:"전체 업로드 전에 민감 정보를 가려낼 수 있게 도와줘.",why:"안전한 준비가 가능합니다."},{prompt:"여기서 개인정보 식별 정보가 무엇인지 찾아서 제거해 줘.",why:"PII를 탐지하고 줄일 수 있습니다."}],
    beforeAfter:{before:"고객 전체 리스트를 넣고 추세 분석해 줘.",after:"이름, 이메일, 전화번호를 지우고 회사명도 익명화한 뒤, 세그먼트별 매출 추세만 분석해 줘.",improvement:"식별자는 제거하고 분석 가치는 유지합니다."},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   섹션별 SVG 비주얼
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"당신의 목표",{bold:true})}{tx(276,39,"AI 초안",{bold:true})}{tx(180,137,"당신의 판단",{bold:true})}{tx(180,84,"검토하고, 결정하고, 실행하기",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","일반 채팅"],["54","38","252","24","프로젝트 + 캔버스"],["68","68","224","24","메모리 + 지침"],["82","98","196","24","GPT + 학습 + 스킬"],["96","128","168","24","작업 + 앱 + 에이전트"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"단순함",{dim:true,size:8})}{tx(336,146,"강력함",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","목표"],["126","8","맥락"],["234","8","규칙"],["18","92","형식"],["126","92","품질"],["234","92","검증"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","구도"],["100","초안"],["170","비판"],["240","수정"],["310","완성"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"매 단계마다 더 구체해진다",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"원문",{bold:true})}{tx(180,38,"변환",{bold:true})}{tx(294,38,"결과물",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. 점검",{dim:true,size:9})}{tx(252,126,"2. 결론",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"1차 자료",{bold:true})}{tx(242,69,"2차 자료",{bold:true})}{tx(242,109,"추론",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","텍스트"],["120","이미지"],["204","음성"],["288","편집"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"모드를 연결해서 써라",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","녹음"],["100","6","120","42","학습"],["100","78","120","42","그룹"],["238","24","80","42","공유"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","메모리"],["100","10","120","40","지침"],["232","10","108","40","성격"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"일관된 출력",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"채팅",{bold:true})}{tx(166,76,"파일",{bold:true})}{tx(264,52,"소스",{bold:true,size:9})}{tx(264,100,"규칙",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","역할"],["116","4","96","42","지식"],["116","94","96","42","도구"],["234","48","110","42","규칙"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"개요",{bold:true,size:10})}{tx(190,22,"초안",{bold:true,size:10})}{tx(290,22,"수정",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","목표"],["90","6","64","40","탐색"],["90","94","64","40","파일"],["174","6","64","40","앱"],["174","94","64","40","코드"],["258","48","80","40","완료"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","자동"],["116","4","72","40","빠름"],["116","96","72","40","심화"],["268","48","72","40","프로"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"강한 기능에는 분명한 경계가 필요하다",{dim:true,size:9})}</svg>,
  };
  return V[type] || null;
}

/* ─────────────────────────────────────────────
   하위 컴포넌트
   ───────────────────────────────────────────── */
function FeatureCard({ title, ico, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>추천 상황: </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, ico, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-3.5 w-3.5" style={{ color }} /></div>
        <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>전후 비교</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">약한 프롬프트</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">강한 프롬프트</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: C.greenDeep }}>
        <Ico name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: C.borderLight }}>
      <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{prompt}</div>
      <div className="mt-1.5 text-[11px] leading-snug" style={{ color: C.inkMuted }}>{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Ico name={section.ico} className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <Ico name="chevronDown" className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
      </button>
      {isExpanded && (
        <div className="border-t px-5 pb-7 pt-6 md:px-6" style={{ borderColor: C.borderLight }}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[14px] leading-[1.8]" style={{ color: C.ink }}>{section.summary}</p>
              <div className="rounded-xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>왜 중요한가</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>여기서 시작</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>심화 활용</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="arrowRight" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>자주 하는 실수</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="alertTriangle" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
              </div>
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>시각 모델</div>
                <SectionVisual type={section.visual} />
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>프롬프트 예시</div>
                <div className="space-y-2.5">{section.promptExamples.map((p, i) => <PromptExample key={i} {...p} />)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   메인
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const toggleSection = useCallback((id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(GUIDE_SECTIONS.map(s => s.id))), []);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const filteredSections = useMemo(() => GUIDE_SECTIONS.filter(s => {
    if (level !== "all" && s.level !== level) return false;
    if (!query.trim()) return true;
    return [s.title, s.summary, s.whyItMatters, ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes, ...s.promptExamples.map(p => p.prompt), s.beforeAfter.before, s.beforeAfter.after].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [level, query]);

  const sectionsByLevel = useMemo(() => {
    const g = { foundation: [], core: [], power: [], expert: [] };
    filteredSections.forEach(s => g[s.level]?.push(s));
    return g;
  }, [filteredSections]);
  const levelLabels = { foundation: "기초", core: "핵심 기능", power: "고급 기능", expert: "전문가" };

  return (
    <div className="ff-body min-h-screen" style={{ backgroundColor: C.cream, color: C.ink }}>
      <GlobalStyles />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* 헤더 */}
        <header className="overflow-hidden rounded-3xl border" style={{ borderColor: C.borderLight, background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.cream} 40%, ${C.creamDark} 100%)` }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><Ico name="bookOpen" className="h-3.5 w-3.5" /> 실전 참고서</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>ChatGPT 완전 활용 가이드</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>각 도구가 무엇을 하는지, 언제 써야 하는지, 그리고 어떻게 해야 결과를 눈에 띄게 개선할 수 있는지를 정리했습니다. 먼저 일반 사용자를 기준으로 쓰되, 더 깊이 들어가고 싶은 사람을 위한 섹션도 함께 담았습니다.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> 검증일 {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 16개 섹션 &middot; 60개 이상 프롬프트</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>오늘날 ChatGPT가 하는 일</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","답변","채팅, 검색"],["150","4","120","38","정리","프로젝트, 메모리"],["284","4","120","38","생성","캔버스, 이미지"],["16","120","120","38","학습","학습, 녹음"],["150","120","120","38","공유","그룹, 링크"],["284","120","120","38","실행","작업, 에이전트"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>전체 기능 구조</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* 여섯 가지 원칙 */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>여섯 가지 원칙</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"명확하게 요청하라",d:"목표, 맥락, 제약, 형식을 밝혀라."},{ico:"layoutGrid",t:"맞는 계층을 골라라",d:"채팅, 프로젝트, 캔버스, 검색, 에이전트."},{ico:"shield",t:"중요할수록 검증하라",d:"최신 정보나 고위험 주제는 검색하라."},{ico:"refreshCcw",t:"다시 쓰지 말고 수정하라",d:"좋은 결과는 두 번째 패스에서 나온다."},{ico:"bot",t:"잘 된 방식은 시스템화하라",d:"프로젝트, GPT, 작업, 스킬로 남겨라."},{ico:"eye",t:"시각화로 더 빨리 생각하라",d:"표, 다이어그램, 스크린샷을 활용하라."}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* 도구 선택표 */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>판단 표</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>어떤 도구를 써야 할까?</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>목표</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>추천 도구</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>이유</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* 프롬프트 공식 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>프롬프트 패턴</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>어떤 프롬프트든 좋아지게 만드는 여섯 블록</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b,i)=><div key={b.label} className="rounded-xl border p-4" style={{borderColor:C.borderLight,backgroundColor:C.cream}}>
              <div className="mb-1.5 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{backgroundColor:b.color}}>{i+1}</span><span className="text-[13px] font-semibold" style={{color:C.ink}}>{b.label}</span></div>
              <p className="ff-mono text-[11px] leading-relaxed" style={{color:C.inkLight}}>{b.example}</p>
            </div>)}
          </div>
        </section>

        {/* 핵심 기능 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>기능 스택</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>ChatGPT 핵심 도구</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{CORE_FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}</div>
        </section>

        {/* 추가 기능 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>놓치기 쉬운 기능</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>대부분의 사용자가 잘 모르는 기능</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ADDITIONAL_FEATURES.map(f=><MiniFeature key={f.title} {...f}/>)}</div>
        </section>

        {/* 내비게이터 */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border bg-white p-4 shadow-lg md:p-5" style={{borderColor:C.border}}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative mr-auto">
              <Ico name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="검색..." className="w-full rounded-xl border py-2 pl-10 pr-3 text-[13px] outline-none sm:w-48" style={{borderColor:C.border,backgroundColor:C.cream}}/>
            </div>
            {LEVELS.map(l=><button key={l.key} onClick={()=>setLevel(l.key)} className="rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all" style={level===l.key?{backgroundColor:C.greenDeep,color:"#fff"}:{border:`1px solid ${C.border}`,color:C.inkLight}}>{l.label}</button>)}
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>모두 펼치기</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>모두 접기</button>
          </div>
        </section>

        {/* 가이드 섹션 */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* 범위 + 핵심 한 줄 */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>범위</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>이 가이드가 다루는 것</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>엔터프라이즈 관리자 기능이 아니라 사용자 기능 중심.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>제품 잡학보다 실전 활용에 초점.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>사용 가능 여부는 요금제와 플랫폼에 따라 달라질 수 있음.</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>가장 큰 업그레이드</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>"프롬프트를 어떻게 더 잘 쓰지?"만 묻지 마라</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>"이 작업에는 ChatGPT의 어느 계층이 맞는가?"를 먼저 물어라. 그 전환이 프롬프트 요령보다 결과를 더 크게 바꾼다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">최종 정리</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">숙련은 이렇게 보인다</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>맞는 모드를 고르고, 일을 분명히 정의하고, 중요한 부분은 검증하고, 똑똑하게 수정하고, 잘 된 방식을 재사용 가능한 시스템으로 남겨라. 가장 잘 쓰는 사람은 AI를 쓰는 사람이기 전에 생각이 분명한 사람이다.</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              <br />
              ChatGPT 사용자 가이드
              <br />
              © 2026 EugeneYip.com All Rights Reserved. 
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">계속 다시 확인할 것</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["기능","요금","릴리스 노트","프로젝트","메모리 FAQ","캔버스","작업","앱","검색","딥 리서치","학습 모드","녹음","공유 링크","그룹","스킬","에이전트","음성","이미지 FAQ"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
