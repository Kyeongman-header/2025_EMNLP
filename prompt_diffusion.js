// prompt_diffusion.js
// 사용법 예: prompt_diffusion.html?type=both&p=0000
// type: both | rep | hidden | none  (필수)
// p: 0000..0004 (필수)

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const type = (params.get('type') || '').toLowerCase(); // 'both' | 'rep' | 'hidden' | 'none'
  const pcode = params.get('p'); // '0000'..'0004'
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

  // type별 고정 trial 번호
  const trialMap = {
    both: 61,
    rep: 1,
    hidden: 23,
    none: 7,
  };
  const trial = trialMap[type];

  container.innerHTML = `<h1>Diffusion — ${type} — ${pLabel}</h1><div id="images"></div>`;
  const imagesDiv = document.getElementById('images');

  // 마지막 5개 인덱스
  const lastFive = ['010', '011', '012', '013', '014'];

  const renderImages = async () => {
    imagesDiv.innerHTML = `<h2>trial${trial} — ${pLabel} (마지막 5개: i010~i014)</h2><div class="grid"></div>`;
    const grid = document.querySelector('.grid');

    let foundCount = 0;
    for (const idx of lastFive) {
      const url = `${baseDir}/sweep_hidden_diffusion_trial${trial}_reedsyPrompts_${pLabel}_i${idx}.png`;
      // fetch로 확인하지 않고 그냥 <img> 태그 출력 (없는 경우 alt로 표시)
      const fig = document.createElement('figure');
      fig.className = 'img-card';
      fig.innerHTML = `<img src="${url}" alt="not found: ${pLabel} i${idx}" /><figcaption>${pLabel} — i${idx}</figcaption>`;
      grid.appendChild(fig);
      foundCount++;
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
  };

  renderImages();
});