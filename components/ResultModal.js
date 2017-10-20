import React, { PureComponent } from 'react'
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
  Clipboard,
  Linking,
  Share,
  Alert
} from 'react-native'
import { isUri } from 'valid-url'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import colors from '../constants/colors'

import { openURL } from '../utils'

class ResultModal extends PureComponent {
  render () {
    const { onDone, show, data, type } = this.props
    return (
      <Modal
        animationType='slide'
        transparent
        visible={show}
        onRequestClose={onDone}
      >
        <View style={[StyleSheet.absoluteFill, styles.overlay]}>
          <View style={styles.resultContainer}>
            <Text style={styles.title}>Code Found!</Text>
            <Text selectable style={styles.result}>
              {data}
            </Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.action}
                onPress={() => this.handleCopyToClipboard(data)}
              >
                <MaterialCommunityIcons
                  size={40}
                  name={'content-copy'}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.action}
                onPress={() => this.handleShare(data)}
              >
                <MaterialCommunityIcons
                  size={40}
                  name={'share'}
                  color={colors.primary}
                />
              </TouchableOpacity>
              {isUri(data) && (
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => this.handleOpenLink(data)}
                >
                  <MaterialCommunityIcons
                    size={40}
                    name={'link'}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Button title='DONE' onPress={onDone} color={colors.secondary} />
          </View>
        </View>
      </Modal>
    )
  }

  handleCopyToClipboard = str => {
    Clipboard.setString(str)
    Alert.alert('Done!', 'Copied to clipboard')
  }

  handleOpenLink = async url => {
    try {
      await openURL(url)
    } catch (error) {
      Alert.alert('Oops!', "We can't open the url")
    }
  }

  handleShare = message => {
    Share.share({
      title: 'Scanned with Swifty QR',
      message
    })
  }
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultContainer: {
    marginTop: 30,
    width: '70%',
    height: '60%',
    backgroundColor: colors.white,
    borderRadius: 2,
    alignItems: 'center',
    padding: 15
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  action: { padding: 5, margin: 10 },
  title: { color: colors.black, fontSize: 18, fontWeight: '500' },
  result: { flex: 1, textAlign: 'center', overflow: 'hidden', marginTop: 20 },
})

export default ResultModal
