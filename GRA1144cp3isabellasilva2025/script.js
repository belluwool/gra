const canvas = document.getElementById('footprintCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const footprintHistory = [];
const maxFootprints = 50; 

const footprintImg = new Image();
footprintImg.src = 'footprint.png'; 
const footprintSize = 30; 

let lastFootprintX = null;
let lastFootprintY = null;
const footprintSpacing = 25; 

document.addEventListener('mousemove', (e) => {
  if (lastFootprintX === null || lastFootprintY === null) {
    lastFootprintX = e.clientX;
    lastFootprintY = e.clientY;
  }

  const dx = e.clientX - lastFootprintX;
  const dy = e.clientY - lastFootprintY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= footprintSpacing) {
    footprintHistory.push({
      x: e.clientX,
      y: e.clientY,
      opacity: 1.0,
      age: 0,
      lifespan: 30 
    });

  
    if (footprintHistory.length > maxFootprints) {
      footprintHistory.shift();
    }

    lastFootprintX = e.clientX;
    lastFootprintY = e.clientY;
  }
});

function animate() {
 ctx.clearRect(0, 0, canvas.width, canvas.height); // wipe clean each frame

  footprintHistory.forEach((footprint, index) => {
    footprint.opacity = 1 - (footprint.age / footprint.lifespan);

    if (footprint.opacity <= 0) {
      footprintHistory.splice(index, 1);
    } else {
      ctx.globalAlpha = footprint.opacity;
      ctx.drawImage(
        footprintImg,
        footprint.x - footprintSize / 2,
        footprint.y - footprintSize / 2,
        footprintSize,
        footprintSize
      );
      footprint.age++;
    }
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}

footprintImg.onload = () => {
  animate();
	
};