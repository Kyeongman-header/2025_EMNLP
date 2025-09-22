// prompt_diffusion.js
// 사용: 2025_EACL/diffusion_*/prompt_diffusion.html?type=both|rep|hidden|none&p=0000..0004

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const type = (params.get('type') || '').toLowerCase();
  const pcode = params.get('p'); // '0000'..'0004'
  const container = document.getElementById('app');

  if (!['both', 'rep', 'hidden', 'none'].includes(type)) {
    container.innerHTML = `<p>유효한 type(both|rep|hidden|none)을 지정해주세요.</p>`;
    return;
  }
  if (!/^\d{4}$/.test(pcode) || +pcode < 0 || +pcode > 4) {
    container.innerHTML = `<p>유효한 p 코드(0000~0004)를 지정해주세요.</p>`;
    return;
  }

  // 현재 HTML은 이미 diffusion_* 폴더 안에서 열림 → baseDir은 현재 폴더
  const baseDir = '.'; // 중요!
  const pLabel = `p${pcode}`;

  const trialMap = { both: 61, rep: 1, hidden: 23, none: 7 };
  const trial = trialMap[type];

  container.innerHTML = `<h1>Diffusion — ${type} — ${pLabel}</h1><div id="images"></div>`;
  const imagesDiv = document.getElementById('images');

  const lastFive = ['010', '011', '012', '013', '014'];

  imagesDiv.innerHTML = `<h2>trial${trial} — ${pLabel} (마지막 5개: i010~i014)</h2><div class="grid"></div>`;
  const grid = document.querySelector('.grid');

  lastFive.forEach(idx => {
    const url = `${baseDir}/sweep_hidden_diffusion_trial${trial}_reedsyPrompts_${pLabel}_i${idx}.png`;
    const fig = document.createElement('figure');
    fig.className = 'img-card';
    fig.innerHTML = `<img src="${url}" alt="not found: ${pLabel} i${idx}" /><figcaption>${pLabel} — i${idx}</figcaption>`;
    grid.appendChild(fig);
  });

  const qDiv = document.createElement('div');
  qDiv.id = 'questions';
  qDiv.innerHTML = `
    <h3>질문</h3>
    <ol>
      <li>질문 1. Diversity...</li>
      <li>질문 2. Degeneration...</li>
      <li>질문 3. Creativity...</li>
      <li>질문 4. Coherence...</li>
    </ol>`;
  container.appendChild(qDiv);
});
