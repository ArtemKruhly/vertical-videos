window.VF = window.VF || {};

VF.createTopBar = function () {
  const el = document.createElement('div');
  el.id = 'topbar';
  el.innerHTML = `
    <div class="tabs">
      <span data-tab="following">Subscriptions</span>
      <span data-tab="foryou" class="active">Suggested</span>
    </div>
  `;
  return { el };
};
