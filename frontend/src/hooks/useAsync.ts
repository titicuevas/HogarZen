import { useState, useCallback, useRef } from 'react'

// =====================================================
// TIPOS
// =====================================================
interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface AsyncActions<T> {
  execute: (...args: any[]) => Promise<T>
  reset: () => void
  setData: (data: T) => void
  setError: (error: Error) => void
}

type AsyncFunction<T> = (...args: any[]) => Promise<T>

// =====================================================
// HOOK USE ASYNC
// =====================================================
export function useAsync<T>(
  asyncFunction: AsyncFunction<T>,
  immediate = false
): AsyncState<T> & AsyncActions<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const mountedRef = useRef(true)

  // =====================================================
  // MANEJADORES
  // =====================================================
  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const data = await asyncFunction(...args)
        
        if (mountedRef.current) {
          setState({ data, loading: false, error: null })
        }
        
        return data
      } catch (error) {
        if (mountedRef.current) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error(String(error))
          })
        }
        throw error
      }
    },
    [asyncFunction]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null }))
  }, [])

  const setError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error, loading: false }))
  }, [])

  // =====================================================
  // EFECTO DE LIMPIEZA
  // =====================================================
  const cleanup = useCallback(() => {
    mountedRef.current = false
  }, [])

  // =====================================================
  // EJECUCIÓN INMEDIATA
  // =====================================================
  if (immediate) {
    execute()
  }

  return {
    ...state,
    execute,
    reset,
    setData,
    setError
  }
}

// =====================================================
// HOOK PARA OPERACIONES CRUD
// =====================================================
export function useCRUD<T, CreateData = Partial<T>, UpdateData = Partial<T>>(
  createFn: (data: CreateData) => Promise<T>,
  updateFn: (id: string, data: UpdateData) => Promise<T>,
  deleteFn: (id: string) => Promise<void>,
  fetchFn: (id: string) => Promise<T>
) {
  const [items, setItems] = useState<T[]>([])
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = useCallback(async (data: CreateData) => {
    setLoading(true)
    setError(null)
    
    try {
      const newItem = await createFn(data)
      setItems(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [createFn])

  const update = useCallback(async (id: string, data: UpdateData) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedItem = await updateFn(id, data)
      setItems(prev => prev.map(item => 
        (item as any).id === id ? updatedItem : item
      ))
      if (selectedItem && (selectedItem as any).id === id) {
        setSelectedItem(updatedItem)
      }
      return updatedItem
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [updateFn, selectedItem])

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await deleteFn(id)
      setItems(prev => prev.filter(item => (item as any).id !== id))
      if (selectedItem && (selectedItem as any).id === id) {
        setSelectedItem(null)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [deleteFn, selectedItem])

  const fetch = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const item = await fetchFn(id)
      setSelectedItem(item)
      return item
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  const reset = useCallback(() => {
    setItems([])
    setSelectedItem(null)
    setError(null)
  }, [])

  return {
    items,
    selectedItem,
    loading,
    error,
    create,
    update,
    remove,
    fetch,
    setSelectedItem,
    reset
  }
}

// =====================================================
// HOOK PARA PAGINACIÓN
// =====================================================
export function usePagination<T>(
  fetchFn: (page: number, limit: number) => Promise<{ data: T[], total: number }>,
  initialPage = 1,
  initialLimit = 10
) {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const totalPages = Math.ceil(total / limit)

  const fetchData = useCallback(async (pageNum: number, limitNum: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchFn(pageNum, limitNum)
      setData(result.data)
      setTotal(result.total)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum)
      fetchData(pageNum, limit)
    }
  }, [fetchData, limit, totalPages])

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
    fetchData(1, newLimit)
  }, [fetchData])

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      goToPage(page + 1)
    }
  }, [page, totalPages, goToPage])

  const prevPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1)
    }
  }, [page, goToPage])

  return {
    data,
    total,
    page,
    limit,
    loading,
    error,
    totalPages,
    fetchData,
    goToPage,
    changeLimit,
    nextPage,
    prevPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }
} 