// Generate 400 squares (20x20)
const grid = document.getElementById('grid');
let isMouseDown = false;

// Plant emojis array
const plantEmojis = ['🏵️', '🌱', '🪴', '🌵', '🌿', '☘️', '🌻', '🌼'];

// Function to add plant emoji to a square
function addPlantEmoji(square) {
  if (square.classList.contains('clicked') && !square.querySelector('.plant-emoji')) {
    const emoji = document.createElement('div');
    emoji.className = 'plant-emoji';
    emoji.textContent = plantEmojis[Math.floor(Math.random() * plantEmojis.length)];
    emoji.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 150%;
      pointer-events: none;
      z-index: 1;
    `;
    square.style.position = 'relative';
    square.appendChild(emoji);
  }
}

// Create coordinate display tooltip
const coordinateTooltip = document.createElement('div');
coordinateTooltip.id = 'coordinate-tooltip';
coordinateTooltip.style.cssText = `
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: #FFD600;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  pointer-events: none;
  z-index: 1000;
  display: none;
  font-weight: bold;
`;
document.body.appendChild(coordinateTooltip);

// Function to convert grid index to battlefield coordinates
function getCoordinates(index) {
  const row = Math.floor(index / 20);
  const col = index % 20;
  // Convert to battlefield style: numbers 1-20 for columns, letters A-T for rows
  const letter = String.fromCharCode(65 + row); // A=0, B=1, etc.
  const number = col + 1; // 1-20 instead of 0-19
  return `${number}${letter}`;
}

// Function to update tooltip position
function updateTooltipPosition(e) {
  coordinateTooltip.style.left = (e.clientX + 10) + 'px';
  coordinateTooltip.style.top = (e.clientY - 30) + 'px';
}

for (let i = 0; i < 400; i++) {
  const square = document.createElement('div');
  square.className = 'grid-square';
  square.dataset.index = i; // Store the index for coordinate calculation
  
  // Mouse down event - start painting
  square.addEventListener('mousedown', function(e) {
    e.preventDefault(); // Prevent text selection
    isMouseDown = true;
    this.classList.toggle('clicked'); // Toggle on mouse down
    
    // If square becomes yellow, set random timer for plant emoji
    if (this.classList.contains('clicked')) {
      const randomDelay = Math.random() * 3000 + 3000; // Random between 3-6 seconds
      setTimeout(() => addPlantEmoji(this), randomDelay);
    }
  });
  
  // Mouse enter event - continue painting while dragging and show coordinates
  square.addEventListener('mouseenter', function(e) {
    if (isMouseDown) {
      this.classList.add('clicked'); // Always add yellow when dragging
      // Set random timer for plant emoji on newly painted squares
      const randomDelay = Math.random() * 3000 + 3000; // Random between 3-6 seconds
      setTimeout(() => addPlantEmoji(this), randomDelay);
    }
    
    // Show coordinate tooltip
    const coordinates = getCoordinates(parseInt(this.dataset.index));
    coordinateTooltip.textContent = coordinates;
    coordinateTooltip.style.display = 'block';
    updateTooltipPosition(e);
  });
  
  // Mouse move event - update tooltip position
  square.addEventListener('mousemove', function(e) {
    updateTooltipPosition(e);
  });
  
  // Mouse leave event - hide tooltip
  square.addEventListener('mouseleave', function() {
    coordinateTooltip.style.display = 'none';
  });
  
  grid.appendChild(square);
}

// Global mouse up event
document.addEventListener('mouseup', function() {
  isMouseDown = false;
});

// Prevent context menu on right click
grid.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// Hide tooltip when mouse leaves the grid entirely
grid.addEventListener('mouseleave', function() {
  coordinateTooltip.style.display = 'none';
});

// ----- Modal 1 Setup -----

const images1 = [
  'images/photo1.jpg',
  'images/photo2.jpg',
  'images/photo3.jpg',
  'images/photo4.jpg'
];
let currentIndex1 = 0;

const modal1 = document.getElementById("imageModal");
const modalImg1 = document.getElementById("modalImg");
const openModalBtn1 = document.getElementById("openModalBtn");
const closeModalBtn1 = modal1.querySelector(".close");
const prevBtn1 = document.getElementById("prevBtn");
const nextBtn1 = document.getElementById("nextBtn");

function showImage1(index) {
  modalImg1.src = images1[index];
}

openModalBtn1.addEventListener("click", () => {
  console.log('Modal 1 open button clicked');
  modal1.style.display = "block";
  showImage1(currentIndex1);
});

closeModalBtn1.addEventListener("click", () => {
  modal1.style.display = "none";
});

prevBtn1.addEventListener("click", () => {
  currentIndex1 = (currentIndex1 - 1 + images1.length) % images1.length;
  showImage1(currentIndex1);
});

nextBtn1.addEventListener("click", () => {
  currentIndex1 = (currentIndex1 + 1) % images1.length;
  showImage1(currentIndex1);
});


// ----- Modal 2 Setup -----

const singleImage2 = 'images/photoone.jpg';

const modal2 = document.getElementById("imageModal2");
const modalImg2 = document.getElementById("modalImg2");
const openModalBtn2 = document.getElementById("openModalBtn2");
const closeModalBtn2 = modal2.querySelector(".close2");
const prevBtn2 = document.getElementById("prevBtn2");
const nextBtn2 = document.getElementById("nextBtn2");

openModalBtn2.addEventListener("click", () => {
  console.log('Modal 2 open button clicked');
  modal2.style.display = "block";
  modalImg2.src = singleImage2;
});

closeModalBtn2.addEventListener("click", () => {
  modal2.style.display = "none";
});

// Disable prev/next buttons since only one image
prevBtn2.disabled = true;
nextBtn2.disabled = true;

// Bee cursor follower with flying behavior
let bee = document.getElementById('bee');
let mouseX = 0;
let mouseY = 0;
let beeX = 0;
let beeY = 0;
let isFlying = false;
let flyingTimer;
let flyingInterval;

// Flying animation variables
let flyTargetX = 0;
let flyTargetY = 0;
let flySpeed = 0.02;

document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Stop flying when user moves mouse
    if (isFlying) {
        isFlying = false;
        clearInterval(flyingInterval);
    }
    
    // Reset the flying timer
    clearTimeout(flyingTimer);
    flyingTimer = setTimeout(startFlying, 5000); // 5 seconds
});

function startFlying() {
    isFlying = true;
    setNewFlyTarget();
    
    flyingInterval = setInterval(function() {
        setNewFlyTarget();
    }, 3000); // Change direction every 3 seconds
}

function setNewFlyTarget() {
    // Pick a random point on screen
    flyTargetX = Math.random() * (window.innerWidth - 100) + 50;
    flyTargetY = Math.random() * (window.innerHeight - 100) + 50;
}

function animateBee() {
    let deltaX, deltaY;
    
    if (isFlying) {
        // Flying behavior - move towards random target
        deltaX = flyTargetX - beeX;
        deltaY = flyTargetY - beeY;
        
        beeX += deltaX * flySpeed;
        beeY += deltaY * flySpeed;
        
        // Add slight wobble for more natural flying
        beeX += Math.sin(Date.now() * 0.01) * 0.5;
        beeY += Math.cos(Date.now() * 0.008) * 0.3;
    } else {
        // Normal cursor following behavior
        deltaX = mouseX - beeX;
        deltaY = mouseY - beeY;
        
        beeX += deltaX * 0.1;
        beeY += deltaY * 0.1;
    }
    
    bee.style.left = beeX + 'px';
    bee.style.top = beeY + 'px';
    
    // Flip bee based on movement direction
    if (deltaX > 0) {
        bee.style.transform = 'translate(-50%, -50%) scaleX(1)';
    } else {
        bee.style.transform = 'translate(-50%, -50%) scaleX(-1)';
    }
    
    requestAnimationFrame(animateBee);
}

function initializeBee() {
    beeX = window.innerWidth / 2;
    beeY = window.innerHeight / 2;
    mouseX = beeX;
    mouseY = beeY;
    
    // Start flying timer
    flyingTimer = setTimeout(startFlying, 5000);
    
    animateBee();
}

window.addEventListener('load', initializeBee);

// Handle window resize
window.addEventListener('resize', function() {
    beeX = Math.min(beeX, window.innerWidth);
    beeY = Math.min(beeY, window.innerHeight);
});
