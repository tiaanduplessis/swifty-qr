import { Linking, Share } from 'react-native'
import createLogger from 'react-native-log-level'

export const log = createLogger({ level: 'debug' })

export async function openURL (url) {
  const supported = Linking.canOpenURL(url)

  if (supported) {
    await Linking.openURL(url)
  }
}
