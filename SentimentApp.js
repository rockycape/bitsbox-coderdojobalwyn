function hello() {
  this.dance()
  }

fill('white')
handle01 = 'halwave'
handle02 = 'robot17'
handle03 = 'robot4'

positive = stamp(handle01,150,500)
neutral = stamp(handle02,380,510,280)
negative = stamp(handle03,620,510,300)

scorep = 0
scoren = 0
scorenn = 0
scoreboardp = text(scorep,150,300)
scoreboardn = text(scoren,380,300)
scoreboardnn = text(scorenn,620,300)

function tap() {
  if (x <= 240) {
  scorep = scorep + 1
  scoreboardp.change(scorep,150,300)
  }
  if (x > 240 && x < 500) {
  scoren = scoren + 1
  scoreboardn.change(scoren,380,300)
  }
  else if (x >= 500) {
  scorenn = scorenn + 1
  scoreboardnn.change(scorenn,620,300)
  }
}

positive.tap = hello
neutral.tap = hello
negative.tap = hello
