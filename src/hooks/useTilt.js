export function tiltHandlers(strength = 1) {
  function onMouseMove(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translateY(-4px) rotateX(${(-y * 5 * strength).toFixed(2)}deg) rotateY(${(x * 7 * strength).toFixed(2)}deg)`;
  }
  function onMouseLeave(e) {
    e.currentTarget.style.transform = '';
  }
  return { onMouseMove, onMouseLeave };
}
