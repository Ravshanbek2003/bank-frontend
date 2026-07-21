import { useCallback, useEffect, useState } from 'react'

interface State<T> {
   data: T | null
   loading: boolean
   error: string | null
}

/**
 * Oddiy data-fetch hook. `deps` o'zgarsa qayta yuklaydi.
 * `reload()` — qo'lda qayta yuklash uchun.
 */
export function useApi<T>(
   fetcher: () => Promise<T>,
   deps: unknown[] = [],
): State<T> & { reload: () => void } {
   const [state, setState] = useState<State<T>>({
      data: null,
      loading: true,
      error: null,
   })

   // eslint-disable-next-line react-hooks/exhaustive-deps
   const memoFetcher = useCallback(fetcher, deps)

   const load = useCallback(() => {
      let active = true
      setState(s => ({ ...s, loading: true, error: null }))
      memoFetcher()
         .then(data => {
            if (active) setState({ data, loading: false, error: null })
         })
         .catch((err: unknown) => {
            const message =
               (err as { response?: { data?: { error?: { msg?: string } } } })
                  ?.response?.data?.error?.msg ||
               (err as Error)?.message ||
               'Xatolik yuz berdi'
            if (active) setState({ data: null, loading: false, error: message })
         })
      return () => {
         active = false
      }
   }, [memoFetcher])

   useEffect(() => load(), [load])

   return { ...state, reload: load }
}
