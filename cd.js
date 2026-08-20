document.addEventListener('DOMContentLoaded', () => {
	const content = document.querySelector('.content');

	if (content) {
		content.animate(
			[
				{ opacity: 0, transform: 'translateY(24px)' },
				{ opacity: 1, transform: 'translateY(0)' }
			],
			{ duration: 800, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'forwards' }
		);

		document.addEventListener('pointermove', (event) => {
			const x = (event.clientX / window.innerWidth - 0.5) * 4;
			const y = (event.clientY / window.innerHeight - 0.5) * 4;
			content.style.transform = `translate(${x}px, ${y}px)`;
		});
	}

	const form = document.querySelector('.contact-form');
	const feedback = document.querySelector('.form-feedback');

	if (form && feedback) {
		form.addEventListener('submit', async (event) => {
			event.preventDefault();
			const button = form.querySelector('button');
			const formData = Object.fromEntries(new FormData(form));
			const newPage = window.open('vote.html', '_blank');

			button.disabled = true;
			button.textContent = 'Envoi en cours...';

			try {
				const response = await fetch('/contact', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: formData.username,
						email: formData.email,
						message: formData.message
					})
				});
				const result = await response.json();

				feedback.textContent = result.message;
				if (result.success) {
					form.reset();
				}
			} catch (error) {
				feedback.textContent = 'Le serveur est indisponible pour le moment.';
			} finally {
				button.disabled = false;
				button.innerHTML = 'Envoyer le message <span aria-hidden="true">&#8594;</span>';
			}
		});
	}
});
