points = 0
size = 225
speed = 10
rocket = stamp('rocket', size)
rocket.vx = 0
rocket.vy = 0

score = text(points, 20, 20, 'white')
message = text('Ready?', 330, 650, 40, 'black')

// --- Controls ---
function shoot() {
  sound('laser')
  // Use a bright, large sprite for the laser blast
  var offset = 50
  var rad = rocket.angle * Math.PI / 180
  var sx = rocket.x + offset * Math.sin(rad)
  var sy = rocket.y - offset * Math.cos(rad)
  shot = stamp('pixel sword', sx, sy, 80, 'red')
  // Move bullet in direction rocket is facing, faster and longer
  var moveDir = rocket.angle
  shot.move(moveDir, 25, 30)
}

// Automatic shooting every half second
function autoShoot() {
  shoot()
  delay(autoShoot, 2000)
}
autoShoot()

function drag(x, y) {
  // Use astronaut movement logic, but apply thrust as velocity
  spot = x - 384
  thrust = (750 - y) / 100 * speed
  rad = rocket.angle * Math.PI / 180
  rocket.vx += thrust * Math.sin(rad)
  rocket.vy += -thrust * Math.cos(rad)
  rocket.rotate(spot / 2)
}

// --- Asteroids ---
function spawnAsteroid() {
  x = random(0, 768)
  y = random(0, 200)
  asteroid = stamp('asteroid', x, y)
  asteroid.size = 3
  asteroid.vx = random(-2, 2)
  asteroid.vy = random(-2, 2)
}

function breakAsteroid(asteroid) {
  size = asteroid.size
  asteroid.hide()
  if (size > 1) {
    repeat(function() {
      piece = stamp('asteroid', asteroid.x, asteroid.y)
      piece.size = size - 1
      piece.vx = random(-3, 3)
      piece.vy = random(-3, 3)
    }, 2)
  }
}

// --- Collisions ---
function checkShot(shot) {
  strikes = shot.hits('asteroid')
  if (strikes.length > 0) {
    sound('hit')
    shot.hide()
    breakAsteroid(strikes[0])
    points = points + 100
    score.change(points)
  }
}

function wrap(obj) {
  if (obj.x > 768) obj.x = 0
  if (obj.x < 0) obj.x = 768
  if (obj.y > 1024) obj.y = 0
  if (obj.y < 0) obj.y = 1024
}

// --- Animate ---
function animate() {
  // Move rocket with inertia
  rocket.x += rocket.vx
  rocket.y += rocket.vy
  wrap(rocket)

  // Lasers
  find('pixel sword').forEach(function(l) {
    l.x += l.vx
    l.y += l.vy
    wrap(l)
    checkShot(l)
  })

  // Asteroids
  find('asteroid').forEach(function(a) {
    a.x += a.vx
    a.y += a.vy
    wrap(a)
  })

  // Collision: rocket vs asteroid
  // Rocket is indestructible: do nothing on collision
}

function startGame() {
  message.change('')
  repeat(spawnAsteroid, 5)
  loop = animate
}
delay(startGame, 2000)

// Ensure drag controls work
ondrag = drag
