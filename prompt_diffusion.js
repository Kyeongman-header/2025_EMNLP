// prompt_diffusion.js
// 사용법 예: prompt_diffusion.html?type=both&p=0000&maxTrial=400
// type: both | rep | hidden | none  (필수)
// p: 0000..0004 (필수)  → p0000 ~ p0004 중 하나
// maxTrial: 시도할 trial 상한 (기본 300, 큰 수일수록 체크가 오래 걸림)

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const type = (params.get('type') || '').toLowerCase(); // 'both' | 'rep' | 'hidden' | 'none'
  const pcode = params.get('p'); // '0000'..'0004'
  const maxTrial = parseInt(params.get('maxTrial') || '300', 10);
  const container = document.getElementById('app');

  if (!['both', 'rep', 'hidden', 'none'].includes(type)) {
    container.innerHTML = `<p>유효한 type(both|rep|hidden|none)을 지정해주세요.</p>`;
    return;
  }
  if (!/^\d{4}$/.test(pcode) || parseInt(pcode, 10) < 0 || parseInt(pcode, 10) > 4) {
    container.innerHTML = `<p>유효한 p 코드(0000~0004)를 지정해주세요.</p>`;
    return;
  }

  const baseDir = `diffusion_${type}`;
  const pLabel = `p${pcode}`;
  container.innerHTML = `<h1>Diffusion — ${type} — ${pLabel}</h1><div id="images"></div>`;
  const imagesDiv = document.getElementById('images');

  // 마지막 5개 인덱스
  const lastFive = ['010', '011', '012', '013', '014'];

  // 주어진 URL이 존재하는지 확인
  const checkExists = (url) =>
    fetch(url, { method: 'HEAD' }).then(res => res.ok).catch(() => false);

  // 가장 최신 trial 탐색: maxTrial → 0 역순
  const findLatestTrialForP = async () => {
    for (let t = maxTrial; t >= 0; t--) {
      // 5개 중 하나라도 존재하면 그 trial 사용
      const anyExists = await Promise.any(
        lastFive.map(async idx => {
          const url = `${baseDir}/sweep_hidden_diffusion_trial${t}_reedsyPrompts_${pLabel}_i${idx}.png`;
          const ok = await checkExists(url);
          if (ok) return true;
          throw new Error('notfound');
        })
      ).then(() => true).catch(() => false);

      if (anyExists) return t;
    }
    return null;
  };

  (async () => {
    imagesDiv.innerHTML = `<p>최신 trial을 탐색 중...</p>`;
    const trial = await findLatestTrialForP();
    if (trial === null) {
      imagesDiv.innerHTML = `<p>${pLabel}에 대해 이미지를 찾을 수 없습니다.</p>`;
      return;
    }

    imagesDiv.innerHTML = `<h2>trial${trial} — ${pLabel} (마지막 5개: i010~i014)</h2><div class="grid"></div>`;
    const grid = document.querySelector('.grid');

    let foundCount = 0;
    for (const idx of lastFive) {
      const url = `${baseDir}/sweep_hidden_diffusion_trial${trial}_reedsyPrompts_${pLabel}_i${idx}.png`;
      const ok = await checkExists(url);
      if (ok) {
        const fig = document.createElement('figure');
        fig.className = 'img-card';
        fig.innerHTML = `<img src="${url}" alt="${pLabel} ${idx}" /><figcaption>${pLabel} — i${idx}</figcaption>`;
        grid.appendChild(fig);
        foundCount++;
      }
    }

    if (foundCount === 0) {
      grid.innerHTML = `<p>선택된 trial에서 i010~i014 이미지가 없습니다.</p>`;
    }

    const qDiv = document.createElement('div');
    qDiv.id = 'questions';
    qDiv.innerHTML = `
      <h3>질문</h3>
      <ol>
        <li>질문 1. Diversity. 단순히 인물 이름이나 소재들 이름만 좀 변경된 것 말고, 얼마나 근본적으로 서로 다른 이야기/이미지인가? (1~5점)</li>
        <li>질문 2. Degeneration. 전체적으로 얼마나 구조/형태/텍스트(있을 경우)가 망가지지 않고 자연스러운가? (1~5점)</li>
        <li>질문 3. Creativity. 얼마나 뻔하지 않고 흥미롭고 창의적인 결과인가? (1~5점)</li>
        <li>질문 4. Coherence. 프롬프트 의도와 결과가 일관적으로 맞아떨어지는가? (1~5점)</li>
      </ol>`;
    container.appendChild(qDiv);
  })();
});
