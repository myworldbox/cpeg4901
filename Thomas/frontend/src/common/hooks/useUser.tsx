import { useEffect, useReducer, useRef } from 'react'
import { IDictionary } from '@/modules/Invoice/components/interface';

interface State<T> {
  data?: T
  error?: Error
}

// discriminated union type
type Action<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error }

type Request = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

function useFetch<T = unknown>(url: string, fetchType: Request, data?: IDictionary<any>, additionalHeader?: IDictionary<string>): State<T> {

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false)

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
  }

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'loading':
        return { ...initialState }
      case 'fetched':
        return { ...initialState, data: action.payload }
      case 'error':
        return { ...initialState, error: action.payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, initialState)

  useEffect(() => {
    // Do nothing if the url is not given
    if (!url) return

    cancelRequest.current = false

    const fetchData = async () => {
      dispatch({ type: 'loading' })

      var resource = url.trim();
      var JSONdata = "";

      if (fetchType === 'GET') {
        resource = (resource.endsWith("/")) ? `${resource.slice(0, -1)}?` : `${resource}?`;
        if (data) {
          for (const key in data) resource += `${key}=${data[key]}&`;
          resource  = resource.slice(0, -1);
        }
      } else {
        JSONdata = (data) ? JSON.stringify(data) : "";
      }
      const headers = {'Content-Type': 'application/json', ...additionalHeader}
      const options = {
        method: fetchType,
        headers: headers,
        body: JSONdata,
      };

      console.log(resource);
      console.log(options);
      try {
        
        console.log("Start Fetch");
        const response = await fetch(url, options)
        console.log("Check Fetch");
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        console.log("Fetch Success");

        const data = (await response.json()) as T
        if (cancelRequest.current) return
        
        console.log(data);

        dispatch({ type: 'fetched', payload: data })
      } catch (error) {
        if (cancelRequest.current) return

        dispatch({ type: 'error', payload: error as Error })
      }
    }

    void fetchData()

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return state
}

export default useFetch