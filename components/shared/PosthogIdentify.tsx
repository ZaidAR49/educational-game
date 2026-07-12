"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

interface Props {
  userId: string
  name?: string | null
}

export function PosthogIdentify({ userId, name }: Props) {
  useEffect(() => {
    posthog.identify(userId, {
      name: name ?? undefined,
    })
  }, [userId, name])

  return null
}
