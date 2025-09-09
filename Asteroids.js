fill('stars2')
points = 0
rocket = stamp('rocket', 384, 512)   // center of 768x1024
rocket.scale = 0.5
rocket.vx = 0
rocket.vy = 0

score = text(points, 20, 20, 'white')
message = text('Ready?', 280, 500, 40, 'white')

// --- Controls ---
function tap() {
  sound('laser')
  shot = stamp('laser', rocket.x, rocket.y)
  shot.angle = rocket.angle
  dx = 10 * Math.sin(rocket.angle * Math.PI/180)
  dy = -10 * Math.cos(rocket.angle * Math.PI/180)
  shot.vx = dx
  shot.vy = dy
}

function drag(x, y) {
  // Point ship toward drag location
  rocket.aim(x, y)

  // Apply thrust in that direction
  thrust = 0.3
  rocket.vx += thrust * Math.sin(rocket.angle * Math.PI/180)
  rocket.vy += -thrust * Math.cos(rocket.angle * Math.PI/180)
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
  find('laser').forEach(function(l) {
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
  if (rocket.hits('asteroid')) {
    rocket.explode()
    message.change('Game Over')
    loop = null
  }
}

function startGame() {
  message.change('')
  repeat(spawnAsteroid, 5)
  loop = animate
}
delay(startGame, 2000)
