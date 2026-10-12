import { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { ApiV3Token, TokenInfo } from '@raydium-io/raydium-sdk-v2'
import { useAppStore } from '@/store/useAppStore'
import { fetchHookProgramEnshrined, fetchTransferHookInfo, getTransferHookInfo, isToken2022 } from '@/utils/transferHook'

export type HookSupport = { hooked: false; loading: boolean } | { hooked: true; loading: boolean; hookProgram: string; enshrined?: boolean }

export type HookSupportMap = Record<string, HookSupport>

const NO_HOOK: HookSupport = { hooked: false, loading: false }

/**
 * For each token, report whether its mint carries a transfer hook and, when
 * `poolProgramId` is given, whether that pool program has enshrined the hook
 * program. Tokens from the API list do not carry extension data, so Token-2022
 * mints are read from chain once and cached.
 */
export default function useTransferHookSupport({
  poolProgramId,
  tokens
}: {
  poolProgramId?: PublicKey
  tokens: (ApiV3Token | TokenInfo | undefined)[]
}): HookSupportMap {
  const connection = useAppStore((s) => s.connection)
  const [support, setSupport] = useState<HookSupportMap>({})
  const key = tokens.map((t) => `${t?.address ?? ''}:${t?.programId ?? ''}`).join('|')
  const programKey = poolProgramId?.toBase58() ?? ''

  useEffect(() => {
    let cancelled = false
    const next: HookSupportMap = {}
    const pending: Promise<void>[] = []

    for (const token of tokens) {
      if (!token) continue
      if (!isToken2022(token)) {
        next[token.address] = NO_HOOK
        continue
      }
      const known = getTransferHookInfo(token)
      const resolveHook = known || !connection ? Promise.resolve(known) : fetchTransferHookInfo(connection, token.address)
      next[token.address] = { hooked: false, loading: true }
      pending.push(
        resolveHook.then(async (hook) => {
          if (!hook) {
            next[token.address] = NO_HOOK
            return
          }
          let enshrined: boolean | undefined
          if (poolProgramId && connection) {
            try {
              enshrined = await fetchHookProgramEnshrined(connection, poolProgramId, hook.programId)
            } catch {
              enshrined = undefined
            }
          }
          next[token.address] = { hooked: true, loading: false, hookProgram: hook.programId, enshrined }
        })
      )
    }

    setSupport({ ...next })
    if (pending.length) {
      Promise.all(pending).then(() => {
        if (!cancelled) setSupport({ ...next })
      })
    }
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, programKey, connection])

  return support
}

/** First token (by the given order) whose hook program is not enshrined, if any. */
export function findUnsupportedHook(
  support: HookSupportMap,
  tokens: (ApiV3Token | TokenInfo | undefined)[]
): ApiV3Token | TokenInfo | undefined {
  return tokens.find((t) => {
    const s = t ? support[t.address] : undefined
    return !!s && s.hooked && s.enshrined === false
  })
}

export function isHookCheckLoading(support: HookSupportMap, tokens: (ApiV3Token | TokenInfo | undefined)[]): boolean {
  return tokens.some((t) => {
    const s = t ? support[t.address] : undefined
    return !!s && s.loading
  })
}
