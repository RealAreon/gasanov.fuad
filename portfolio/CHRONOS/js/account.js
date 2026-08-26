document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.account-tab');
  const panels = document.querySelectorAll('.account-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.id === `panel-${target}`));
    });
  });

  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showMessage('Вхід виконано успішно. Ласкаво просимо до CHRONOS!');
  });

  document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showMessage('Реєстрацію завершено. Перевірте email для підтвердження облікового запису.');
  });

  function showMessage(text) {
    const msg = document.getElementById('account-message');
    if (!msg) return;
    msg.textContent = text;
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 4000);
  }
});
