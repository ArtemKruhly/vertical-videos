window.VF = window.VF || {};

VF.createSidebar = function (reel) {
  const toK = VF.toK;
  const el = document.createElement('div');
  el.className = 'side';
  el.innerHTML = `
  <div class="user-block">
    <div class="avatar">${reel.avatar}</div>
    <div class="username">${reel.user}</div>
  </div>

  <button class="like-btn" type="button" aria-label="Like">
    <span class="icon">🤍</span>
    <span class="count">${toK(reel.likes)}</span>
  </button>

  <button type="button" aria-label="Comments">
    <span class="icon">💬</span>
    <span class="count">${toK(reel.comments)}</span>
  </button>

  <button type="button" aria-label="Share">
    <span class="icon">➤</span>
    <span class="count">Share</span>
  </button>
`;

  const likeBtn = el.querySelector('.like-btn');
  const icon = likeBtn.querySelector('.icon');
  const count = likeBtn.querySelector('.count');
  let liked = false;

  function render() {
    icon.textContent = liked ? '❤️' : '🤍';
    count.textContent = toK(liked ? reel.likes + 1 : reel.likes);
    likeBtn.classList.toggle('liked', liked);
  }

  function toggleLike() {
    liked = !liked;
    render();
  }

  likeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLike();
  });

  return {
    el,
    likeOnly() {
      if (!liked) {
        toggleLike();
      }
    }
  };
};
