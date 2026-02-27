import { C } from '../tokens.js'
import { img } from '../images.js'

export default function IOLogo({ size = 32, inverted = false }) {
  const logoSrc = img("logo")
  if (logoSrc) {
    return <img src={logoSrc} alt="Investment Officer" style={{ height: size, width:"auto", display:"block", ...(inverted ? { filter:"brightness(0) invert(1)" } : {}) }} />
  }
  const fill = inverted ? C.white : C.navy
  const stroke = inverted ? C.white : C.navy
  return (
    <svg width={size * 2.8} height={size * 0.75} viewBox="0 0 112 30" fill="none">
      <text x="0" y="22" fontFamily="'Merriweather', serif" fontSize="26" fontWeight="700" fill={fill}>io</text>
      <line x1="38" y1="4" x2="38" y2="26" stroke={stroke} strokeWidth="1.5"/>
      <text x="44" y="15" fontFamily="'Merriweather Sans', sans-serif" fontSize="9.5" fontWeight="700" fill={fill}>investment</text>
      <text x="44" y="26" fontFamily="'Merriweather Sans', sans-serif" fontSize="9.5" fontWeight="400" fill={fill}>officer</text>
    </svg>
  )
}
