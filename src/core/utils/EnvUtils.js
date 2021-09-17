import { isArray } from './WebUtils'

const ENV_LHIP = ['127.0.0.1', 'localhost', '::1']

export const isLocalhost = (list = [], host = ((window || 0).location || 0).hostname) => {
  return ENV_LHIP.indexOf(host) !== -1 || (
    isArray(list) && list.length > 0 ? list.indexOf(host) !== -1 : false
  )
}
