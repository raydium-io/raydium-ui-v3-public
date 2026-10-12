import { Connection, PublicKey } from '@solana/web3.js'
import { ApiV3Token, TokenInfo } from '@raydium-io/raydium-sdk-v2'
import { TOKEN_2022_PROGRAM_ID, getTransferHook, unpackMint } from '@solana/spl-token'

/**
 * Token-2022 transfer-hook helpers.
 *
 * Raydium CPMM / CLMM only accept a hooked mint when the hook program has been
 * enshrined by the admin: a `SupportHookProgram` PDA (seed "support_hook",
 * hook program id) exists under the pool program. The program checks it at pool
 * creation; the UI checks it up front so the user gets a clear message instead
 * of a failed transaction.
 */

export const SUPPORT_HOOK_SEED = 'support_hook'

export interface TransferHookInfo {
  programId: string
  authority: string
}

export function getPdaSupportHookProgram(programId: PublicKey, hookProgram: PublicKey): { publicKey: PublicKey; nonce: number } {
  const [publicKey, nonce] = PublicKey.findProgramAddressSync([Buffer.from(SUPPORT_HOOK_SEED, 'utf8'), hookProgram.toBuffer()], programId)
  return { publicKey, nonce }
}

/** Transfer-hook info carried on a token's `extensions`, if the token info was built from chain data. */
export function getTransferHookInfo(token?: ApiV3Token | TokenInfo): TransferHookInfo | undefined {
  const hook = (token?.extensions as { transferHook?: TransferHookInfo } | undefined)?.transferHook
  if (!hook || !hook.programId || hook.programId === PublicKey.default.toBase58()) return undefined
  return hook
}

export function isToken2022(token?: ApiV3Token | TokenInfo): boolean {
  return token?.programId === TOKEN_2022_PROGRAM_ID.toBase58()
}

const hookInfoCache = new Map<string, Promise<TransferHookInfo | undefined>>()

/** Read the mint from chain and return its active transfer hook, if any. */
export function fetchTransferHookInfo(connection: Connection, mint: PublicKey | string): Promise<TransferHookInfo | undefined> {
  const key = mint.toString()
  const cached = hookInfoCache.get(key)
  if (cached) return cached
  const req = (async () => {
    const address = new PublicKey(key)
    const info = await connection.getAccountInfo(address)
    if (!info || !info.owner.equals(TOKEN_2022_PROGRAM_ID)) return undefined
    const hook = getTransferHook(unpackMint(address, info, TOKEN_2022_PROGRAM_ID))
    if (!hook || hook.programId.equals(PublicKey.default)) return undefined
    return { programId: hook.programId.toBase58(), authority: hook.authority.toBase58() }
  })().catch(() => {
    hookInfoCache.delete(key)
    return undefined
  })
  hookInfoCache.set(key, req)
  return req
}

const enshrinedCache = new Map<string, Promise<boolean>>()

/** True when `poolProgramId` has enshrined `hookProgramId` (its SupportHookProgram PDA exists). */
export function fetchHookProgramEnshrined(
  connection: Connection,
  poolProgramId: PublicKey,
  hookProgramId: PublicKey | string
): Promise<boolean> {
  const hook = new PublicKey(hookProgramId)
  const key = `${poolProgramId.toBase58()}-${hook.toBase58()}`
  const cached = enshrinedCache.get(key)
  if (cached) return cached
  const req = connection
    .getAccountInfo(getPdaSupportHookProgram(poolProgramId, hook).publicKey)
    .then((info) => !!info && info.owner.equals(poolProgramId))
    .catch((e) => {
      enshrinedCache.delete(key)
      throw e
    })
  enshrinedCache.set(key, req)
  return req
}
