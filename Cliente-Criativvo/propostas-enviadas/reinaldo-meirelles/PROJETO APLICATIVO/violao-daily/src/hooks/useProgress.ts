import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { units } from '../data/units'

// Calcula progresso por unidade e progresso geral.
export function useProgress() {
  const { lessons } = useApp()

  return useMemo(() => {
    const totalCompleted = lessons.filter((l) => l.status === 'completed').length
    const totalLessons = lessons.length

    const byUnit = units.map((unit) => {
      const unitLessons = lessons.filter((l) => l.unitId === unit.id)
      const completed = unitLessons.filter((l) => l.status === 'completed').length
      const current = unitLessons.find((l) => l.status === 'current')
      const total = unitLessons.length
      return {
        unit,
        lessons: unitLessons,
        completed,
        total,
        progress: total === 0 ? 0 : Math.round((completed / total) * 100),
        currentLesson: current ?? null,
        isUnitCompleted: completed === total,
      }
    })

    const currentUnit = byUnit.find((u) => u.currentLesson) ?? byUnit[0]

    return {
      totalCompleted,
      totalLessons,
      overallProgress: totalLessons === 0 ? 0 : Math.round((totalCompleted / totalLessons) * 100),
      byUnit,
      currentUnit,
    }
  }, [lessons])
}
