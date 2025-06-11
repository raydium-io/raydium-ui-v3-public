import { confetti } from 'tsparticles-confetti'

type ConfettiOptions = Parameters<typeof confetti>[0]
const confettiOptions: ConfettiOptions = {
  // to layer on top of chakra overlay
  zIndex: 10_000,
  spread: 260,
  ticks: 75,
  gravity: 0.4,
  decay: 0.95,
  startVelocity: 30,
  particleCount: 300,
  scalar: 2
}

export const genericConfetti = () => {
  return confetti(confettiOptions)
}
