// Interaktives Aktivitäts-Raster: Hover-Anzeige, Rollenauswahl, Sprung zur Station
const career = document.querySelector('.career');

if (career) {
  const readout = career.querySelector('.heatmap__readout');
  const grid = career.querySelector('.heatmap__grid');
  const buttons = [...career.querySelectorAll('.legend button')];
  const hint = readout.dataset.hint;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = null;

  const describe = (button) => `${button.dataset.label} · ${button.dataset.range}`;
  const idle = () => {
    const button = buttons.find((b) => b.dataset.role === selected);
    return button ? describe(button) : hint;
  };
  const show = (text) => { readout.textContent = text; };

  function select(role) {
    selected = selected === role ? null : role;

    if (selected) career.dataset.selected = selected;
    else delete career.dataset.selected;

    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.role === selected));
    }

    for (const el of career.querySelectorAll('[data-active]')) delete el.dataset.active;

    if (selected) {
      const target = document.getElementById(`role-${selected}`);
      target.dataset.active = '';
      target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
    }

    show(idle());
  }

  grid.addEventListener('mouseover', (event) => {
    const cell = event.target.closest('.cell[data-tip]');
    if (cell) show(cell.dataset.tip);
  });
  grid.addEventListener('mouseleave', () => show(idle()));
  grid.addEventListener('click', (event) => {
    const cell = event.target.closest('.cell[data-role]');
    if (cell) select(cell.dataset.role);
  });

  for (const button of buttons) {
    button.addEventListener('click', () => select(button.dataset.role));
    button.addEventListener('mouseenter', () => show(describe(button)));
    button.addEventListener('focus', () => show(describe(button)));
    button.addEventListener('mouseleave', () => show(idle()));
    button.addEventListener('blur', () => show(idle()));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && selected) select(selected);
  });
}
