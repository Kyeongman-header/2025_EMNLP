// 공통 스크립트: prompt.html에서 사용

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const prompt = parseInt(params.get('prompt'), 10);
  const version = params.has('version') ? parseInt(params.get('version'), 10) : null;
  const container = document.getElementById('app');
  // 실제로 존재하는 버전 목록 (config 파일이 있는 버전)
  const availableVersions = [1,2,3,4,5,6,7,8,10,11,12,14,15];

  if (!prompt || prompt < 1 || prompt > 10) {
    container.innerHTML = '<p>유효한 prompt 번호(1-10)를 지정해주세요.</p>';
    return;
  }

  if (!version) {
    // 버전 목록 렌더
    let html = `<h1>Prompt ${prompt}</h1><h2>버전 선택</h2><ul class="version-list">`;
    availableVersions.forEach(v => {
      html += `<li><a href="?prompt=${prompt}&version=${v}">Version ${v}</a></li>`;
    });
    html += '</ul>';
    container.innerHTML = html;

  } else if (!availableVersions.includes(version)) {
    container.innerHTML = `<p>해당 Version(${version})의 결과가 없습니다.</p>`;

  } else {
    // Stories 및 질문 렌더
    container.innerHTML = `<h1>Prompt ${prompt} — Version ${version}</h1><div id="stories"></div>`;
    const storiesDiv = document.getElementById('stories');

    fetch(`config_${version}_result.json`)
      .then(res => {
        if (!res.ok) throw new Error('파일을 찾을 수 없습니다');
        return res.json();
      })
      .then(data => {
        const answers = data.results[prompt - 1].answers;
        answers.forEach((s, i) => {
          const div = document.createElement('div');
          div.className = 'story';
          div.innerHTML = `<h3>Story ${i + 1}</h3><p>${s}</p>`;
          storiesDiv.appendChild(div);
        });

        const qDiv = document.createElement('div');
        qDiv.id = 'questions';
        qDiv.innerHTML = `
          <h3>질문</h3>
          <ol>
            <li>질문 1</li>
            <li>질문 2</li>
            <li>질문 3</li>
            <li>질문 4</li>
          </ol>`;
        storiesDiv.appendChild(qDiv);
      })
      .catch(e => {
        storiesDiv.innerHTML = `<p>JSON 로드 실패: ${e.message}</p>`;
      });
  }
});