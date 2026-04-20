/**
 * projects.js — 프로젝트 필터링 (HOA02)
 *
 * 동작 방식:
 *   1. .filter-btn 클릭 시 data-filter 값 읽기
 *   2. 각 .project-card의 data-category 와 비교
 *   3. 일치하면 표시, 아니면 .hidden 클래스 추가 (CSS로 display:none)
 *
 * 💡 CUSTOMIZE: 새 카테고리 추가 방법
 *   - projects.html에서 필터 버튼: <button class="filter-btn" data-filter="카테고리">이름</button>
 *   - 카드에: <article class="project-card" data-category="카테고리">
 *   (data-filter 값과 data-category 값이 같아야 함)
 */

(function () {
  const filterBar = document.getElementById('filterBar');
  const cards     = document.querySelectorAll('.project-card');
  const noResults = document.getElementById('noResults');

  if (!filterBar) return; // projects.html이 아니면 종료

  filterBar.addEventListener('click', function (e) {
    // 클릭된 요소가 버튼인지 확인
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // 이전 active 버튼 해제 → 클릭된 버튼 active
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter; // 'all' or 카테고리 문자열
    let visibleCount = 0;

    cards.forEach(card => {
      const category = card.dataset.category;
      // 'all' 이거나 카테고리가 일치하면 표시
      const isVisible = filter === 'all' || category === filter;

      card.classList.toggle('hidden', !isVisible);
      if (isVisible) visibleCount++;
    });

    // 결과 없음 메시지
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
})();
