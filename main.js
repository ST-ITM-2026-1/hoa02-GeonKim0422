/**
 * main.js — 공통 스크립트 (모든 페이지에서 로드)
 *
 * 기능: 다크/라이트 테마 스위처 (HOA02)
 *   - localStorage에 선택값 저장 → 페이지 이동 후에도 유지
 *   - body에 .dark 클래스를 토글 → CSS 변수로 전체 테마 전환
 */

(function () {
  /* 💡 CUSTOMIZE: localStorage 키 이름 (충돌 방지용, 변경해도 됨) */
  const STORAGE_KEY = 'portfolio-theme';

  /**
   * 테마 적용 함수
   * @param {boolean} isDark - true면 다크 모드
   */
  function applyTheme(isDark) {
    // body 클래스 토글 → CSS 변수가 body.dark 기준으로 바뀜
    document.body.classList.toggle('dark', isDark);

    const icon  = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');

    if (icon)  icon.textContent  = isDark ? '☀️' : '🌙';
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
  }

  /** 버튼 클릭 시 테마 반전 */
  function toggleTheme() {
    const isDark = !document.body.classList.contains('dark');
    // 💡 CUSTOMIZE: 기본 테마를 다크로 바꾸려면 아래 조건을 반전
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    applyTheme(isDark);
  }

  // 페이지 로드 시 저장된 테마 적용 (기본값: light)
  const saved  = localStorage.getItem(STORAGE_KEY);
  const isDark = saved === 'dark';
  applyTheme(isDark);

  // 버튼에 이벤트 연결
  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', toggleTheme);
})();
