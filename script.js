const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
if (window.scrollY > 300) {
    backToTop.style.opacity="1";
    backToTop.style.pointerEvents="auto";
} else {
    backToTop.style.opacity="0";
    backToTop.style.pointerEvents="none";
}
});

backToTop.addEventListener("click", () => {
window.scrollTo({
    top: 0,
    behavior: "smooth"
});
});

