function Showable(className, tag) {
    let visible = false;
    let hideTimeout;
    let showTimeout;

    const div = document.createElement(tag || 'div');
    div.classList.add(className, 'showable');

    return {
        div,
        show: () => {
            if (visible) return false;
            visible = true;
            clearTimeout(hideTimeout);
            clearTimeout(showTimeout);
            div.classList.add('visible');
            showTimeout = setTimeout(() => {
                div.style.opacity = 1;
            });
            return true;
        },
        hide: () => {
            if (!visible) return false;
            visible = false;
            clearTimeout(hideTimeout);
            clearTimeout(showTimeout);
            div.style.opacity = 0;
            hideTimeout = setTimeout(() => {
                div.classList.remove('visible');
            }, 200);
            return true;
        },
    }
}
export default Showable;
