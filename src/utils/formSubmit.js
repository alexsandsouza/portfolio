const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/alexsandfarias@gmail.com';

export async function submitToInbox(formData) {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
    });
    const payload = await res.json().catch(() => ({}));
    const message = String(payload.message || '');
    const needsActivation = /activat/i.test(message);
    const accepted = res.ok && String(payload.success).toLowerCase() !== 'false' && !needsActivation;
    return { accepted, needsActivation };
}
