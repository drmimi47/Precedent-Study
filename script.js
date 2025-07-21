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


// Growing Riversiders D3.js Visualization - Modular Version
// This script is self-contained and won't interfere with existing website code

(function() {
    'use strict';
    
    // Check if D3 is available
    if (typeof d3 === 'undefined') {
        console.error('Growing Riversiders Visualization: D3.js is required. Please include D3.js v7 before this script.');
        return;
    }
    
    // Check if container exists
    if (!document.getElementById('growing-riversiders-container')) {
        console.error('Growing Riversiders Visualization: Container element not found. Please include the HTML container.');
        return;
    }
    
    class GrowingRiversidersViz {
        constructor() {
            this.plantTypes = ['Sunflower', 'Marigold', 'Cosmos', 'Zinnia'];
            this.plantColors = {
                'Sunflower': '#f1c40f',
                'Marigold': '#e67e22',
                'Cosmos': '#e91e63',
                'Zinnia': '#9b59b6'
            };
            
            this.currentMode = 'plant-types';
            this.gridSize = 20;
            this.pixelSize = 15;
            
            this.familyNames = [
                'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 
                'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
                'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
                'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
                'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
                'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
                'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans',
                'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
                'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez',
                'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly',
                'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson',
                'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
                'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel',
                'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
            ];
            
            this.generateData();
            this.init();
        }
        
        generateData() {
            this.gridData = [];
            this.timelineData = [];
            
            
            // Generate grid data
            for (let row = 0; row < this.gridSize; row++) {
                for (let col = 0; col < this.gridSize; col++) {
                    const index = row * this.gridSize + col;
                    
                    this.gridData.push({
                        id: `plant_${index}`,
                        row: row,
                        col: col,
                        index: index,
                        plantType: this.plantTypes[Math.floor(Math.random() * this.plantTypes.length)],
                        family: this.familyNames[Math.floor(Math.random() * this.familyNames.length)],
                        finalHeight: Math.floor(Math.random() * 80) + 20, // 20-100cm
                        survived: Math.random() > 0.08, // 92% survival rate
                        photosShared: Math.floor(Math.random() * 15) + 1,
                        messages: Math.floor(Math.random() * 8) + 1,
                        weeklyGrowth: this.generateWeeklyGrowth()
                    });
                }
            }
            
            // Generate timeline data (6 weeks)
            for (let week = 1; week <= 6; week++) {
                const averageHeight = this.gridData.reduce((sum, plant) => 
                    sum + plant.weeklyGrowth[week - 1], 0) / this.gridData.length;
                
                const totalPhotos = this.gridData.reduce((sum, plant) => 
                    sum + Math.floor(plant.photosShared * (week / 6)), 0);
                
                const platformInteractions = Math.floor(100 + (week * 50) + Math.random() * 100);
                
                this.timelineData.push({
                    week: week,
                    averageHeight: Math.round(averageHeight * 10) / 10,
                    totalPhotos: totalPhotos,
                    platformInteractions: platformInteractions,
                    participatingFamilies: Math.min(100, Math.floor(80 + (week * 3)))
                });
            }
        }
        
        generateWeeklyGrowth() {
            const growth = [];
            let currentHeight = 0;
            for (let week = 0; week < 6; week++) {
                const weekGrowth = Math.random() * 15 + 5; // 5-20cm per week
                currentHeight += weekGrowth;
                growth.push(Math.round(currentHeight * 10) / 10);
            }
            return growth;
        }
        
        init() {
            this.createGrid();
            this.createTimeline();
            this.setupControls();
            this.updateLegend();
            this.updateVisualization();
        }
        
        createGrid() {
            const container = d3.select('#gr-pixel-grid');
            const containerWidth = container.node().getBoundingClientRect().width;
            const maxGridWidth = Math.min(containerWidth - 40, 400);
            
            this.pixelSize = Math.floor(maxGridWidth / this.gridSize);
            
            const svg = container.append('svg')
                .attr('width', this.gridSize * this.pixelSize)
                .attr('height', this.gridSize * this.pixelSize)
                .style('display', 'block')
                .style('margin', '0 auto');
            
            this.gridSvg = svg;
            
            // Create grid pixels
            this.pixels = svg.selectAll('.gr-pixel')
                .data(this.gridData)
                .enter()
                .append('rect')
                .attr('class', 'gr-pixel')
                .attr('x', d => d.col * this.pixelSize)
                .attr('y', d => d.row * this.pixelSize)
                .attr('width', this.pixelSize - 1)
                .attr('height', this.pixelSize - 1);
        }
        
        createTimeline() {
            const container = d3.select('#gr-timeline-chart');
            const margin = {top: 20, right: 80, bottom: 50, left: 60};
            const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;
            
            const svg = container.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);
            
            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
            
            // Scales
            const xScale = d3.scaleLinear()
                .domain([1, 6])
                .range([0, width]);
            
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(this.timelineData, d => d.averageHeight) * 1.1])
                .range([height, 0]);
            
            const yScalePhotos = d3.scaleLinear()
                .domain([0, d3.max(this.timelineData, d => d.totalPhotos) * 1.1])
                .range([height, 0]);
            
            // Lines
            const heightLine = d3.line()
                .x(d => xScale(d.week))
                .y(d => yScale(d.averageHeight))
                .curve(d3.curveMonotoneX);
            
            const photosLine = d3.line()
                .x(d => xScale(d.week))
                .y(d => yScalePhotos(d.totalPhotos))
                .curve(d3.curveMonotoneX);
            
            // Add axes
            g.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(xScale).tickFormat(d => `Week ${d}`));
            
            g.append('g')
                .call(d3.axisLeft(yScale));
            
            g.append('g')
                .attr('transform', `translate(${width},0)`)
                .call(d3.axisRight(yScalePhotos))
                .style('color', '#e67e22');
            
            // Add lines
            g.append('path')
                .datum(this.timelineData)
                .attr('fill', 'none')
                .attr('stroke', '#27ae60')
                .attr('stroke-width', 3)
                .attr('d', heightLine);
            
            g.append('path')
                .datum(this.timelineData)
                .attr('fill', 'none')
                .attr('stroke', '#e67e22')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5')
                .attr('d', photosLine);
            
            // Add data points
            g.selectAll('.gr-height-point')
                .data(this.timelineData)
                .enter()
                .append('circle')
                .attr('class', 'gr-height-point')
                .attr('cx', d => xScale(d.week))
                .attr('cy', d => yScale(d.averageHeight))
                .attr('r', 4)
                .attr('fill', '#27ae60');
            
            // Labels
            g.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 0 - margin.left)
                .attr('x', 0 - (height / 2))
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .style('font-size', '12px')
                .text('Average Plant Height (cm)');
            
            g.append('text')
                .attr('transform', `translate(${width + 40}, ${height / 2}) rotate(-90)`)
                .style('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('fill', '#e67e22')
                .text('Photos Shared');
            
            g.append('text')
                .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
                .style('text-anchor', 'middle')
                .style('font-size', '12px')
                .text('Project Timeline');
        }
        
        setupControls() {
            // Use scoped selectors to avoid conflicts
            d3.select('#growing-riversiders-container').selectAll('.gr-btn').on('click', (event) => {
                d3.select('#growing-riversiders-container').selectAll('.gr-btn').classed('gr-active', false);
                d3.select(event.target).classed('gr-active', true);
                
                this.currentMode = event.target.dataset.mode;
                this.updateLegend();
                this.updateVisualization();
            });
        }
        
        updateLegend() {
            const legend = d3.select('#gr-legend');
            legend.selectAll('*').remove();
            
            let legendItems = [];
            
            switch (this.currentMode) {
                case 'plant-types':
                    legendItems = this.plantTypes.map(type => ({
                        color: this.plantColors[type],
                        label: type
                    }));
                    break;
                case 'growth-stages':
                    legendItems = [
                        { color: '#e74c3c', label: 'Low Growth (< 40cm)' },
                        { color: '#f39c12', label: 'Medium Growth (40-70cm)' },
                        { color: '#27ae60', label: 'High Growth (> 70cm)' }
                    ];
                    break;
            }
            
            const legendContainer = legend.selectAll('.gr-legend-item')
                .data(legendItems)
                .enter()
                .append('div')
                .attr('class', 'gr-legend-item');
            
            legendContainer.append('div')
                .attr('class', 'gr-legend-color')
                .style('background-color', d => d.color);
            
            legendContainer.append('span')
                .text(d => d.label);
        }
        
        updateVisualization() {
            this.pixels.transition()
                .duration(500)
                .attr('fill', d => this.getPixelColor(d))
                .attr('opacity', d => this.getPixelOpacity(d));
        }
        
        getPixelColor(d) {
            switch (this.currentMode) {
                case 'plant-types':
                    return this.plantColors[d.plantType];
                case 'growth-stages':
                    if (d.finalHeight < 40) return '#e74c3c';
                    if (d.finalHeight < 70) return '#f39c12';
                    return '#27ae60';
                default:
                    return '#3498db';
            }
        }
        
        getPixelOpacity(d) {
            return d.survived ? 1 : 0.3;
        }
    }
    
    // Initialize when DOM is ready or immediately if already ready
    function initVisualization() {
        if (typeof window.growingRiversidersViz === 'undefined') {
            window.growingRiversidersViz = new GrowingRiversidersViz();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisualization);
    } else {
        initVisualization();
    }
    
})();