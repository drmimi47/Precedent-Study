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