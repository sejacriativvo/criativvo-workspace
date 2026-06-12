import {
  Award,
  BookOpen,
  Brain,
  Calendar,
  Check,
  Crown,
  Feather,
  Flame,
  Hand,
  Map,
  Mic,
  Music,
  Music2,
  Play,
  RotateCw,
  Shuffle,
  Sparkles,
  Sprout,
  Star,
  Timer,
  Trophy,
  Waves,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const map: Record<string, LucideIcon> = {
  book: BookOpen,
  brain: Brain,
  chord: Music2,
  check: Check,
  calendar: Calendar,
  crown: Crown,
  feather: Feather,
  flame: Flame,
  hand: Hand,
  map: Map,
  metronome: Timer,
  mic: Mic,
  music: Music,
  play: Play,
  quiz: Brain,
  rhythm: Waves,
  rotate: RotateCw,
  shuffle: Shuffle,
  song: Music,
  sparkle: Sparkles,
  sprout: Sprout,
  star: Star,
  timer: Timer,
  trophy: Trophy,
  waves: Waves,
  zap: Zap,
  award: Award,
}

interface IconProps {
  name: string
  className?: string
  strokeWidth?: number
}

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 2 }: IconProps) {
  const Cmp = map[name] ?? Sparkles
  return <Cmp className={className} strokeWidth={strokeWidth} />
}
