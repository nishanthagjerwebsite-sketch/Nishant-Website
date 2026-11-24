// Forms with data-formsubmit are sent through FormSubmit (formsubmit.co) to the address in their action.
// With JavaScript they go to its AJAX endpoint and the visitor stays on the page; without it the form posts normally.
const ORIGIN = 'https://formsubmit.co/';

export function initForms() {
  document.querySelectorAll('form[data-formsubmit]').forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('[type="submit"]');
    const say = (msg) => { if (status) status.textContent = msg; };
    const action = form.getAttribute('action');
    const address = action.slice(ORIGIN.length);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (button.disabled) return;
      button.disabled = true;
      say('Sending…');
      try {
        const res = await fetch(`${ORIGIN}ajax/${address}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const out = await res.json();
        // FormSubmit answers 200 with success "false" when the address has not been activated yet
        if (!res.ok || String(out.success) !== 'true') throw new Error(out.message || res.status);
        form.reset();
        say(form.dataset.success || 'Thank you. Your message has been sent.');
      } catch (err) {
        console.warn('Form not sent:', err.message);
        say(`Sorry, that could not be sent. Please email ${address} instead.`);
      } finally {
        button.disabled = false;
      }
    });
  });
}
