// prompt_diffusion.js
// 사용: diffusion_*/prompt_diffusion.html?type=both|rep|hidden|none&p=0000..0004

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const type = (params.get('type') || '').toLowerCase();
  const pcode = params.get('p');
  const container = document.getElementById('app');

  if (!['both', 'rep', 'hidden', 'none'].includes(type)) {
    container.innerHTML = `<p>유효한 type(both|rep|hidden|none)을 지정해주세요.</p>`;
    return;
  }
  if (!/^\d{4}$/.test(pcode) || +pcode < 0 || +pcode > 4) {
    container.innerHTML = `<p>유효한 p 코드(0000~0004)를 지정해주세요.</p>`;
    return;
  }

  const baseDir = '.'; // 현재 diffusion_* 폴더
  const pLabel = `p${pcode}`;

  // type별 trial 번호
  const trialMap = { both: 61, rep: 1, hidden: 23, none: 7 };
  const trial = trialMap[type];

  // type별 prefix 매핑
  const prefixMap = {
    both:   'sweep_both_diffusion',
    rep:    'sweep_rep_diffusion',
    hidden: 'sweep_hidden_diffusion',
    none:   'sweep_none_diffusion',
  };
  const prefix = prefixMap[type];

  container.innerHTML = `<h1>Diffusion — ${type} — ${pLabel}</h1><div id="images"></div>`;
  const imagesDiv = document.getElementById('images');

  const lastFive = ['010', '011', '012', '013', '014'];

  imagesDiv.innerHTML = `<h2>trial${trial} — ${pLabel} (마지막 5개: i010~i014)</h2><div class="grid"></div>`;
  const grid = document.querySelector('.grid');

  lastFive.forEach(idx => {
    const url = `${baseDir}/${prefix}_trial${trial}_reedsyPrompts_${pLabel}_i${idx}.png`;
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
      <li>Diversity: 근본적으로 다른가?</li>
      <li>Degeneration: 망가지지 않고 자연스러운가?</li>
      <li>Creativity: 뻔하지 않고 흥미로운가?</li>
      <li>Coherence: 프롬프트와 일관성이 있는가?</li>
    </ol>`;
  container.appendChild(qDiv);
});
