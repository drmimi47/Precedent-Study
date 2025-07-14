// Generate 400 squares (20x20)
const grid = document.getElementById('grid');
let isMouseDown = false;

for (let i = 0; i < 400; i++) {
  const square = document.createElement('div');
  square.className = 'grid-square';
  
  // Mouse down event - start painting
  square.addEventListener('mousedown', function(e) {
    e.preventDefault(); // Prevent text selection
    isMouseDown = true;
    this.classList.toggle('clicked'); // Toggle on mouse down
  });
  
  // Mouse enter event - continue painting while dragging
  square.addEventListener('mouseenter', function() {
    if (isMouseDown) {
      this.classList.add('clicked'); // Always add yellow when dragging
    }
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
