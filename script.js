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

// Image sources
const images = [
  'images/photo1.jpg',
  'images/photo2.jpg',
  'images/photo3.jpg',
  'images/photo4.jpg'
];

let currentIndex = 0;

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.querySelector(".close");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Open modal and show first image
openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  showImage(currentIndex);
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Show previous image
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
});

// Show next image
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
});

function showImage(index) {
  modalImg.src = images[index];
}

openModalBtn.addEventListener("click", () => {
  console.log('Open modal clicked');
  modal.style.display = "block";
  showImage(currentIndex);
});