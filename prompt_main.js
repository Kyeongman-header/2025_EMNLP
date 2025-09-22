// prompt_main.js
// 사용: 2025_EACL/main_test_reedsy/prompt_main.html?prompt=1[&version=1..4]
//      2025_EACL/main_test_writing/prompt_main.html?prompt=1[&version=1..4]

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const prompt = parseInt(params.get('prompt'), 10);
  const version = params.has('version') ? parseInt(params.get('version'), 10) : null;
  const container = document.getElementById('app');

  // 현재 HTML은 이미 해당 폴더(main_test_*) 안에서 열림 → baseDir은 현재 폴더
  const baseDir = '.'; // 중요!

  const configs = [
    null,
    'config_both_1_result.json', // 1
    'config_hidden_result.json',  // 2
    'config_rep_result.json',     // 3
    'config_none_1_result.json',  // 4
  ];
  const availableVersions = [1, 2, 3, 4];

  if (!prompt || prompt < 1 || prompt > 10) {
    container.innerHTML = '<p>유효한 prompt 번호(1-10)를 지정해주세요.</p>';
    return;
  }

  if (!version) {
    let html = `<h1>Prompt ${prompt}</h1><h2>버전 선택</h2><ul class="version-list">`;
    availableVersions.forEach(v => {
      html += `<li><a href="?prompt=${prompt}&version=${v}">Version ${v} — ${configs[v]}</a></li>`;
    });
    html += '</ul>';
    container.innerHTML = html;
    return;
  }

  if (!availableVersions.includes(version)) {
    container.innerHTML = `<p>해당 Version(${version})의 결과가 없습니다.</p>`;
    return;
  }

  const targetJson = `${baseDir}/${configs[version]}`;
  container.innerHTML = `<h1>Prompt ${prompt} — Version ${version}</h1><div id="stories"></div>`;
  const storiesDiv = document.getElementById('stories');

  fetch(targetJson)
    .then(res => {
      if (!res.ok) throw new Error('파일을 찾을 수 없습니다');
      return res.json();
    })
    .then(data => {
      const answers = data?.results?.[prompt - 1]?.answers || [];
      const indices = [10, 11, 12, 13, 14].filter(i => i < answers.length);

      if (indices.length === 0) {
        storiesDiv.innerHTML = `<p>해당 prompt의 스토리가 충분하지 않습니다.</p>`;
        return;
      }

      indices.forEach(i => {
        const div = document.createElement('div');
        div.className = 'story';
        div.innerHTML = `<h3>Story ${i + 1}</h3><p>${answers[i]}</p>`;
        storiesDiv.appendChild(div);
      });

      const qDiv = document.createElement('div');
      qDiv.id = 'questions';
      qDiv.innerHTML = `
        <h3>질문</h3>
        <ol>
          <li>질문 1. Diversity. 단순히 인물 이름이나 소재들 이름만 좀 변경된 것 말고, 얼마나 근본적으로 서로 다른 이야기인가? (1~5점)</li>
          <li>질문 2. Degeneration. 전체적으로 얼마나 문장들이 문법 및 어휘 체계가 파괴되지 않고 자연스러운가? (1~5점)</li>
          <li>질문 3. Creativity. 전체적으로 얼마나 뻔하지 않고 흥미롭고 창의적인 이야기들을 만들었나? (1~5점)</li>
          <li>질문 4. Coherence. 각각의 story는 일관성 있는 이야기가 전개되는가? (1~5점)</li>
        </ol>`;
      storiesDiv.appendChild(qDiv);
    })
    .catch(e => {
      storiesDiv.innerHTML = `<p>JSON 로드 실패: ${e.message}</p>`;
    });
});
