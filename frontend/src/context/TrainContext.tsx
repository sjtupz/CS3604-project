import React, { createContext, useContext, useReducer } from 'react'
import type { TrainListItem } from '../api/trains'

interface Filters {
  trainTypes?: string
  seatTypes?: string
  fromStation?: string
  toStation?: string
  departureDate?: string
  timeRange?: string
  sortBy?: 'trainNumber' | 'departureTime' | 'arrivalTime' | 'duration'
  sortOrder?: 'asc' | 'desc'
}

interface TrainState {
  filters: Filters
  trains: TrainListItem[]
  loading: boolean
  error: string | null
}

const initialState: TrainState = {
  filters: {},
  trains: [],
  loading: false,
  error: null,
}

type TrainAction =
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'SET_TRAINS'; payload: TrainListItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

const TrainContext = createContext<{
  state: TrainState
  dispatch: React.Dispatch<TrainAction>
}>({
  state: initialState,
  dispatch: () => null,
})

export const TrainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer((state: TrainState, action: TrainAction): TrainState => {
    switch (action.type) {
      case 'SET_FILTERS':
        return { ...state, filters: { ...state.filters, ...action.payload } }
      case 'SET_TRAINS':
        return { ...state, trains: action.payload }
      case 'SET_LOADING':
        return { ...state, loading: action.payload }
      case 'SET_ERROR':
        return { ...state, error: action.payload }
      default:
        return state
    }
  }, initialState)

  return (
    <TrainContext.Provider value={{ state, dispatch }}>
      {children}
    </TrainContext.Provider>
  )
}

export const useTrainContext = () => useContext(TrainContext)
