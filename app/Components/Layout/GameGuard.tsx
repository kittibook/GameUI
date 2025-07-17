'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useGame from '@/app/Hook/GameHook/context.hook'

export default function GameGuard({ children }: { children: React.ReactNode }) {
  const { loadSetting, gameData } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (loadSetting === true || 
        gameData?.name === "" ||
        gameData?.age === 0 ||
        gameData?.disease === "" ||
        gameData?.dataSet === 0
      ) {
      router.push('/')
    }
  }, [loadSetting, gameData])

  return <>{children}</>
}
