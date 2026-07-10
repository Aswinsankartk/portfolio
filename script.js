//Back to top button
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

//Menu
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

//Animated footer
const wrapper = document.querySelector(".footer_hover-effect");
const canvas = document.createElement("canvas");
canvas.id = "line-effect";
wrapper.appendChild(canvas);

const mouse = { x: -9999, y: -9999 };
const linesFooter = [];
let context;

let horizontalPadding = 0;
let verticalPadding = 0;

const drawWaveEffect = (context, width, height) => {
  horizontalPadding = width * 0.04;
  verticalPadding = height * 0.08;

  const linesCount = 45;
  const lineHeight = (height - verticalPadding * 2) / linesCount;
  const cellWidth = 3;
  const cols = Math.floor((width - horizontalPadding * 2) / cellWidth);

  // const typeCanvasWidth = 300;
  // const typeCanvasHeight = 80;
  const typeCanvasWidth = 120;
  const typeCanvasHeight = 50;
  const typeCanvas = document.createElement("canvas");
  const typeContext = typeCanvas.getContext("2d");
  typeCanvas.width = typeCanvasWidth;
  typeCanvas.height = typeCanvasHeight;

  let fontSize = 40;

  do {
    typeContext.font = `${fontSize}px Drukwide`;
    fontSize--;
  } while (
    typeContext.measureText("ASWIN SANKAR").width >
    typeCanvasWidth * 0.92
  );
  typeContext.fillStyle = "black";
  typeContext.fillRect(0, 0, typeCanvasWidth, typeCanvasHeight);
  typeContext.fillStyle = "white";
  typeContext.textBaseline = "middle";
  typeContext.textAlign = "center";
  typeContext.fillText(
    "ASWIN SANKAR",
    typeCanvasWidth / 2,
    typeCanvasHeight / 2,
  );

  const typeData = typeContext.getImageData(
    0,
    0,
    typeCanvasWidth,
    typeCanvasHeight,
  ).data;

  linesFooter.length = 0;
  for (let i = 0; i < linesCount; i++) {
    const y = verticalPadding + i * lineHeight;
    const line = [];

    for (let j = 0; j < cols; j++) {
      const x = horizontalPadding + j * cellWidth;

      const typeX = Math.floor((j / cols) * typeCanvasWidth);
      const typeY = Math.floor((i / linesCount) * typeCanvasHeight);
      const index = (typeY * typeCanvasWidth + typeX) * 4;
      const brightness = typeData[index] || 0;

      const heightOffset = (brightness / 255) * 28;
      const finalY = y - heightOffset;

      line.push({
        x,
        y: finalY,
        baseX: x,
        baseY: finalY,
      });
    }
    linesFooter.push(line);
  }
};

const updateLines = (mouseX, mouseY, radius = 140, maxSpeed = 10) => {
  linesFooter.forEach((lineFooter) => {
    lineFooter.forEach((point) => {
      const dx = point.x - mouseX;
      const dy = point.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const angle = Math.atan2(dy, dx);
        const force = (radius - distance) / radius;

        point.x += Math.cos(angle) * force * maxSpeed;
        point.y += Math.sin(angle) * force * maxSpeed;
      }

      const springX = (point.baseX - point.x) * 0.1;
      const springY = (point.baseY - point.y) * 0.1;

      point.x += springX;
      point.y += springY;
    });
  });
};

const drawLines = (context, width, height) => {
  context.clearRect(0, 0, width, height);

  linesFooter.forEach((lineFooter) => {
    context.beginPath();
    context.moveTo(lineFooter[0].x, lineFooter[0].y);

    for (let i = 1; i < lineFooter.length; i++) {
      const prev = lineFooter[i - 1];
      const current = lineFooter[i];

      const midX = (prev.x + current.x) / 2;
      const midY = (prev.y + current.y) / 2;

      context.quadraticCurveTo(prev.x, prev.y, midX, midY);
    }

    context.strokeStyle = "hsl(0, 0%, 100%)";
    context.lineWidth = 0.5;
    context.stroke();
  });
};

const resizeCanvas = () => {
  const scaleFactor = window.devicePixelRatio || 1;
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(scaleFactor, scaleFactor);

  drawWaveEffect(context, width, height);
};

const animateFooterLines = () => {
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);

  updateLines(mouse.x, mouse.y);
  drawLines(context, width, height);

  requestAnimationFrame(animateFooterLines);
};

const waitForFonts = async () => {
  if (document.fonts) {
    try {
      await document.fonts.load(`1em Drukwide`);
    } catch (e) {
      console.error("error font:", e);
    }
  }
  resizeCanvas();
  animateFooterLines();
};

const initFooter = () => {
  context = canvas.getContext("2d");
  resizeCanvas();

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener("resize", resizeCanvas);

  waitForFonts();
};

initFooter();
