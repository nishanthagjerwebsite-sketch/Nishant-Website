// Portfolio page: click-to-load YouTube embeds (no third-party requests until clicked).
export function initMedia() {
  document.querySelectorAll('.work[data-youtube-id]').forEach((card) => {
    const id = card.dataset.youtubeId.trim();
    const btn = card.querySelector('.work__media');
    if (!id || !btn) return;
    btn.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
      frame.title = card.dataset.title || 'Performance video';
      frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      btn.replaceWith(frame);
    });
  });
}
