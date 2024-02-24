import {
  GlobalAppContext,
  GlobalAppStateType
} from '@/providers/global-app-state-provider'
import { useContext } from 'react'

export default function useGlobalAppState () {
  return useContext(GlobalAppContext) as GlobalAppStateType
}
