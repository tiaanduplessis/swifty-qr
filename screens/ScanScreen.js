import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import ViewFinder from 'react-native-view-finder'
import { BarCodeScanner, Permissions } from 'expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Container from 'nanokit-container'
import storage from 'react-native-modest-storage'

import ResultModal from '../components/ResultModal'

import colors from '../constants/colors'
import config from '../constants/config'

class ScanScreen extends PureComponent {
  state = {
    hasCameraPermission: null,
    isTorchOn: false,
    isBack: true,
    showModal: false,
    data: '',
    type: ''
  }

  askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  async componentDidMount () {
    await this.askPermission()
  }

  render () {
    const {
      hasCameraPermission,
      isBack,
      isTorchOn,
      data,
      type,
      showModal
    } = this.state

    if (hasCameraPermission === null) {
      return null
    }

    if (hasCameraPermission === false) {
      return (
        <Container center backgroundColor={colors.offWhite}>
          <Text onPress={this.askPermission} style={styles.failureText}>
            Please provide camera access
          </Text>
        </Container>
      )
    }

    return (
      <Container backgroundColor={colors.offWhite}>
        <ResultModal
          show={showModal}
          onDone={this.handleDone}
          data={data}
          type={type}
        />
        <BarCodeScanner
          type={isBack ? 'back' : 'front'}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          torchMode={isTorchOn ? 'on' : 'off'}
          onBarCodeRead={this.handleBarCodeRead}
          style={StyleSheet.absoluteFill}
        />
        <ViewFinder />

        <TouchableOpacity
          onPress={this.handleReverseCamera}
          style={[styles.buttonContainer, { right: 20 }]}
        >
          <MaterialCommunityIcons
            size={25}
            name={isBack ? 'camera-front-variant' : 'camera-rear'}
            color={colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleTorch}
          style={[styles.buttonContainer, { left: 20 }]}
        >
          <MaterialCommunityIcons
            size={25}
            name={isTorchOn ? 'flashlight-off' : 'flashlight'}
            color={colors.primary}
          />
        </TouchableOpacity>
      </Container>
    )
  }

  handleDone = () =>
    this.setState({
      showModal: false
    })
    
  handleReverseCamera = () => this.setState({ isBack: !this.state.isBack })

  handleTorch = () => this.setState({ isTorchOn: !this.state.isTorchOn })

  handleBarCodeRead = ({ type, data }) => {
    const { showModal } = this.state

    if ( showModal) {
      return
    }

    this.setState({
      data,
      type,
      showModal: true
    })
    this.updateHistory({ type, data })
  }

  updateHistory = async data => {
    const history = (await storage.get(config.historyKey)) || []
    await storage.set(config.historyKey, [...history, data])
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: colors.white,
    bottom: 20
  },
  failureText: { color: colors.black, fontSize: 18 }
})

export default ScanScreen
