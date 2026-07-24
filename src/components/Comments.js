window.VF = window.VF || {};

VF.createComments = function (comments = []) {
    const el = document.createElement("div");
    el.className = "comments-sheet";

    el.innerHTML = `
        <div class="comments-backdrop"></div>

        <div class="comments-panel">
            <div class="comments-header">
                <span>${comments.length} comments</span>
                <button class="comments-close">✕</button>
            </div>

            <div class="comments-list">
                ${comments.map(c => `
                    <div class="comment">
                        <div class="comment-avatar">${c.avatar}</div>

                        <div class="comment-body">
                            <div class="comment-user">${c.user}</div>
                            <div class="comment-text">${c.text}</div>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;

    const backdrop = el.querySelector(".comments-backdrop");
    const close = el.querySelector(".comments-close");

    function open() {
        el.classList.add("show");
    }

    function hide() {
        el.classList.remove("show");
    }

    backdrop.addEventListener("click", hide);
    close.addEventListener("click", hide);

    return {
        el,
        open,
        close: hide
    };
};