const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.style.opacity = "1";
    backToTop.style.pointerEvents = "auto";
  } else {
    backToTop.style.opacity = "0";
    backToTop.style.pointerEvents = "none";
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  const clickedOutside =
    !navLinks.contains(e.target) && !menuBtn.contains(e.target);

  if (clickedOutside && navLinks.classList.contains("active")) {
    navLinks.classList.remove("active");
  }
});
