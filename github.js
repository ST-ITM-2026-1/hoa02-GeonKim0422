/**
 * github.js — GitHub Public API 연동 (HOA02)
 *
 * 기능:
 *   1. 프로필 정보 fetch (아바타, 이름, bio, 통계)
 *   2. 공개 레포지토리 목록 fetch (이름, 설명, 언어, stars, forks)
 *   3. 에러 핸들링 + 로딩 상태
 *
 * 💡 CUSTOMIZE: 본인 GitHub 유저네임으로 변경
 */
const GITHUB_USERNAME = 'GeonKim0422';

// ── DOM 요소 ──────────────────────────────
const profileSection = document.getElementById('profileSection');
const reposSection   = document.getElementById('reposSection');

if (profileSection) {
  // github.html에서만 실행
  initGitHub();
}

async function initGitHub() {
  try {
    // 프로필과 레포를 동시에 요청 (Promise.all = 병렬 fetch)
    const [user, repos] = await Promise.all([
      fetchJSON(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetchJSON(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=updated`)
    ]);

    renderProfile(user);
    renderRepos(repos);

  } catch (err) {
    console.error('GitHub fetch error:', err);
    renderError(profileSection, err.message);
    if (reposSection) reposSection.innerHTML = '';
  }
}

/** JSON fetch 헬퍼 — 에러 상태 코드도 throw */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    // 403: Rate limit, 404: 유저 없음
    const msg = res.status === 403
      ? 'API rate limit exceeded. Try again later.'
      : `GitHub API error: ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

/** 프로필 카드 렌더링 */
function renderProfile(user) {
  profileSection.innerHTML = `
    <div class="gh-profile">
      <img
        class="gh-avatar"
        src="${user.avatar_url}"
        alt="${user.login} avatar"
        onerror="this.outerHTML='<div class=\\'gh-avatar-fallback\\'>🐙</div>'"
      />
      <div>
        <!-- 이름 (없으면 유저네임) -->
        <div class="gh-name">${user.name || user.login}</div>
        <div class="gh-login">@${user.login}</div>

        <!-- 💡 CUSTOMIZE: bio가 없으면 이 줄은 자동으로 숨겨짐 -->
        ${user.bio ? `<div class="gh-bio">${user.bio}</div>` : ''}

        <div class="gh-stats">
          <div class="gh-stat">
            <span class="gh-stat-n">${user.public_repos}</span>
            <span class="gh-stat-l">Repos</span>
          </div>
          <div class="gh-stat">
            <span class="gh-stat-n">${user.followers}</span>
            <span class="gh-stat-l">Followers</span>
          </div>
          <div class="gh-stat">
            <span class="gh-stat-n">${user.following}</span>
            <span class="gh-stat-l">Following</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/** 레포 카드 목록 렌더링 */
function renderRepos(repos) {
  if (!repos || repos.length === 0) {
    reposSection.innerHTML = `<p class="gh-error">No public repositories found.</p>`;
    return;
  }

  // 💡 CUSTOMIZE: fork된 레포를 숨기려면 아래 filter 주석 해제
  // repos = repos.filter(r => !r.fork);

  const cards = repos.map(repo => {
    const lang  = repo.language  || '';
    const desc  = repo.description || 'No description.';
    const stars = repo.stargazers_count;
    const forks = repo.forks_count;

    return `
      <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener">
        <div class="repo-name">📁 ${repo.name}</div>
        <p  class="repo-desc">${desc}</p>
        <div class="repo-meta">
          ${lang  ? `<span>🔵 ${lang}</span>` : ''}
          <span>⭐ ${stars}</span>
          <span>🍴 ${forks}</span>
        </div>
      </a>
    `;
  }).join('');

  reposSection.innerHTML = `
    <p class="repos-header">Public Repositories (${repos.length})</p>
    <div class="repos-grid">${cards}</div>
  `;
}

/** 에러 메시지 렌더링 */
function renderError(section, message) {
  section.innerHTML = `
    <div class="gh-error">
      ⚠️ ${message}
      <br>
      <small style="opacity:0.65;display:block;margin-top:0.5rem">
        GitHub API allows 60 requests/hour without authentication.
      </small>
    </div>
  `;
}
