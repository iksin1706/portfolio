const nav = document.getElementById('nav');
const navContainer = document.getElementById('nav-container');
const navButton = document.getElementById('nav-button');
const words = Array.from(document.getElementsByClassName("head__word"));
const cardsContainer = document.querySelector(".projects__container");
const projects = document.querySelector(".projects");

let activeNav = false;
nav.dataset.active = false;

Array.from(document.getElementsByClassName("nav__list__item"))
  .forEach((item, index) => {
    item.onmouseover = () => {
      nav.dataset.activeIndex = index;
    }
  }
  )

navButton.onclick = () => {
  if (!activeNav) {
    nav.dataset.active = true;
    activeNav = true;
  } else {
    nav.dataset.active = false;
    activeNav = false;
  }
}


//WORDS AROUND HEAD
const x = 250;
const y = 150;
const r = 75;
let a = 0;

const rotate = (a, obj) => {
  const px = x + r * 3.5 * Math.cos(a);
  const py = y + r * Math.sin(a);


  obj.style.transform = `translate(${Math.floor(px - obj.offsetWidth / 2)}px,${Math.floor(py - obj.offsetHeight / 2)}px) scale(${(y + 150) / (py + 150)})`;
  obj.style.zIndex = py > y ? 100 : 200;
};

const wordWidth = words[0].offsetWidth;
const distance = wordWidth / (2 * Math.PI * r);

const updateAnimation = () => {
  a = (a + distance / 10) % (2 * Math.PI);
  for (let i = 0; i < words.length; i++) {
    rotate((i * 2 * Math.PI / words.length - a) * 5, words[i]);
  }
  setTimeout(updateAnimation, 200);
};

updateAnimation();


//PROJECTS SLIDER
cardsContainer.dataset.prevPercentage = "0";

projects.addEventListener("mousedown", startDrag);
projects.addEventListener("mouseup", stopDrag);
projects.addEventListener("mousemove", drag);

projects.addEventListener("touchstart", startDrag,{passive: true});
projects.addEventListener("touchend", stopDrag);
projects.addEventListener("touchmove", drag ,{passive: true});

function startDrag(e) {
  if (e.type === "mousedown") {
    cardsContainer.dataset.mouseDownAt = e.clientX;
  } else if (e.type === "touchstart") {
    cardsContainer.dataset.mouseDownAt = e.touches[0].clientX;
  }
}

function stopDrag(e) {
  cardsContainer.dataset.mouseDownAt = "0";
  cardsContainer.dataset.prevPercentage = cardsContainer.dataset.percentage;
}

function drag(e) {
  let clientX;
  if (e.type === "mousemove") {
    clientX = e.clientX;
  } else if (e.type === "touchmove") {
    clientX = e.touches[0].clientX;
  } else {
    return;
  }

  if (cardsContainer.dataset.mouseDownAt === "0") return;

  const mouseDelta = parseFloat(cardsContainer.dataset.mouseDownAt) - clientX;
  maxDelta = cardsContainer.offsetWidth / 3;

  const percentage = (mouseDelta / maxDelta) * 100;
  const nextPercentage = Math.min(Math.max(parseFloat(cardsContainer.dataset.prevPercentage) + percentage, 0), 80);

  cardsContainer.dataset.percentage = nextPercentage;

  cardsContainer.style.transform = `translate(${-nextPercentage}%,-50%)`;

  cardsContainer.animate({
    transform: `translate(${-nextPercentage}%,-50%)`
  }, { duration: 1000, fill: 'forwards' })


  for (const image of cardsContainer.getElementsByClassName('card__image')) {
    image.animate({
      backgroundPosition: `${nextPercentage}% center`
    }, { duration: 1000, fill: 'forwards' })
  }
}



//TYPING ANIMATION


let typingSpeed = 75;

const leftHandAnimation = KUTE.fromTo(
  '#hand1-1',
  { path: '#hand1-1' },
  { path: '#hand1-2' },
  { duration: typingSpeed, yoyo: true, repeat: 999 }
)
const rightHandAnimation = KUTE.fromTo(
  '#hand2-1',
  { path: '#hand2-1' },
  { path: '#hand2-2' },
  { duration: typingSpeed, yoyo: true, repeat: 999 }
)
const headAnimation = KUTE.fromTo(
  '#head1-1',
  { path: '#head1-1' },
  { path: '#head1-2' },
  { duration: 500, yoyo: true }
)
const headAnimation2 = KUTE.fromTo(
  '#head2-1',
  { path: '#head2-1' },
  { path: '#head2-2' },
  { duration: 500, yoyo: true }
)

document.querySelector('.about').addEventListener('mousemove', eyeball);

function eyeball(event) {
  const eyes = document.querySelectorAll('.head__eye');
  eyes.forEach(eye => {
    const { left, top, width, height } = eye.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const radian = Math.atan2(event.pageX - x, event.pageY - y);
    const rotate = radian * (180 / Math.PI) * -1 + 270;
    eye.style.transform = `rotate(${rotate}deg)`;
  });
}

document.querySelector('.hero__header').innerHTML = "";


async function typingAnimation(className, texts, speed) {
  const element = document.querySelector(className);

  for (let i = 0; i < texts.length - 1; i++) {
    const text = texts[i];

    leftHandAnimation.start();
    rightHandAnimation.start();
    for (const char of text) {
      element.innerHTML += char;
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    leftHandAnimation.stop();
    rightHandAnimation.stop();
    await new Promise(resolve => setTimeout(resolve, 500));
    rightHandAnimation.start();
    for (let j = element.innerHTML.length - 1; j >= 0; j--) {
      element.innerHTML = element.innerHTML.substring(0, j);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    rightHandAnimation.stop();

  }

  document.querySelector('.hero__header').classList.add('hero__header--big');
  const finalText = texts[texts.length - 1];
  leftHandAnimation.start();
  rightHandAnimation.start();
  for (const char of finalText) {
    element.innerHTML += char;
    await new Promise(resolve => setTimeout(resolve, speed));
  }
  leftHandAnimation.stop();
  rightHandAnimation.stop();
  headAnimation.reverse();
  headAnimation2.reverse();
  headAnimation.start();
  headAnimation2.start();



}

async function animations() {
  await new Promise(resolve => setTimeout(resolve, 2000));


  headAnimation.start();
  headAnimation2.start();
  await new Promise(resolve => setTimeout(resolve, 1000));
  typingAnimation(".hero__header", ["Hi I'm Łukasz Jasiński", "And this is my", "Portfolio"], typingSpeed);
}

window.addEventListener("load", async () => {
  const preloader = document.getElementById("preloader");
  animations();
  preloader.classList.add("preloader-hidden");
  await new Promise(resolve => setTimeout(resolve, 1000)).then(() => { preloader.style.display = 'none' });

});



for (let i = 1; i <= 3; i++) {
  let tween = KUTE.fromTo(
    '#fire' + i + '-1',
    { path: '#fire' + i + '-1' },
    { path: '#fire' + i + '-3' },
    { duration: i == 3 ? 1000 : 100, yoyo: true, }
  )

  let tween2 = KUTE.fromTo(
    '#fire' + i + '-1',
    { path: '#fire' + i + '-3' },
    { path: '#fire' + i + '-2' },
    { duration: i == 3 ? 1000 : 100, }
  )

  let tween3 = KUTE.fromTo(
    '#fire' + i + '-1',
    { path: '#fire' + i + '-2' },
    { path: '#fire' + i + '-1' },
    { duration: i == 3 ? 1000 : 100, }
  )
  tween.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween);

  tween.start();
}
let tweenLight = KUTE.fromTo(
  '#fire4-1',
  { opacity: 0.75 },
  { opacity: 1 },
  { duration: 150, yoyo: true, repeat: 9999 }
)
tweenLight.start();

const targets = document.querySelectorAll('.trigger');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, {
  rootMargin: '20%',
  threshold: [0.2]
});

targets.forEach((target) => {
  observer.observe(target);
});


//Hide nav
let lastScrollTop = 0;
let isScrollingUp = false;

let navBackground = document.querySelector('.nav__background');
let paralax = document.querySelector('.parallax');
paralax.addEventListener('scroll', () => {
  const currentScrollTop = paralax.scrollTop
  isScrollingUp = currentScrollTop < lastScrollTop;

  lastScrollTop = currentScrollTop;

  if (isScrollingUp) {
    navButton.classList.remove('hidden');
    navBackground.classList.remove('hidden');
  } else {
    navButton.classList.add('hidden');
    navBackground.classList.add('hidden');

  }
});

sections = [
  document.querySelector(".parallax__container"),
  document.querySelector(".about"),
  document.querySelector(".projects"),
  document.querySelector(".contact"),
];


function scrollToElement(section) {

  if (section === "home") paralax.scrollTo({
    top: Position(sections[0]),
    behavior: 'smooth',
  })
  if (section === "about") paralax.scrollTo({
    top: Position(sections[1]),
    behavior: 'smooth',
  })
  if (section === "projects") paralax.scrollTo({
    top: Position(sections[2]),
    behavior: 'smooth',
  })
  if (section === "contact") paralax.scrollTo({
    top: Position(sections[3]),
    behavior: 'smooth',
  })
  nav.dataset.active = false;
  activeNav = false;
}

function Position(obj) {
  var currenttop = 0;
  if (obj.offsetParent) {
    do {
      currenttop += obj.offsetTop;
    } while ((obj = obj.offsetParent));
    return [currenttop];
  }
}

function copyToClipboard(what, text) {
  navigator.clipboard.writeText(text);
  alert(text + " copied to clipboard");
}
var swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  coverflowEffect: {
    rotate: 10,
    stretch: 10,
    depth: 100,
    modifier: 3,
    slideShadows: true
  },
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  breakpoints: {
    640: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 2
    },
    1560: {
      slidesPerView: 2
    }
  }
});

const blob = document.getElementById("blob");

document.querySelector('.about').addEventListener('mousemove', (event) => { 
  const { clientX, clientY } = event;
  xMousePos = clientX;
  yMousePos = clientY;
  console.log("teeeest");
  const scrollY = document.querySelector('.parallax').scrollTop 
  let y = yMousePos + scrollY - window.screen.availHeight
  y = y < 100 ? 100 : y;
    blob.animate({
    
    left: `${clientX}px`,
    top: `${y}px`
  }, { duration: 1000, fill: "forwards" });

});


var xMousePos = 880;
var yMousePos = 800;

document.querySelector('.parallax').addEventListener('scroll', function(event) {
  const { clientX, clientY } = event;
  console.log("teeeest");
  const scrollY = document.querySelector('.parallax').scrollTop 

  let y = yMousePos + scrollY - window.screen.availHeight
  y = y < 100 ? 100 : y;

    blob.animate({
    
    left: `${xMousePos}px`,
    top: `${y}px`
  }, { duration: 1000, fill: "forwards" });
});


