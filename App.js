import React from 'react'
import { Platform, StyleSheet, View, StatusBar, BackHandler, Alert } from 'react-native'
import { AppLoading, Asset, Constants } from 'expo'
import Container from 'nanokit-container'

import Navigation from './navigation'

import colors from './constants/colors'
import config from './constants/config'

console.disableYellowBox = true

export default class App extends React.Component {
    state = {
        isLoadingComplete: false
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBack)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBack)
    }

    handleHardwareBack = () => {
        Alert.alert(
            'Wait!',
            'Would you like to exit?',
            [{ text: 'Cancel' }, { text: 'Yes', onPress: BackHandler.exitApp }],
            { cancelable: false }
        )

        return true
    }

    render() {
        if (!this.state.isLoadingComplete) {
            return (
                <Container>
                    <StatusBar hidden />
                    <AppLoading
                        startAsync={this.loadResourcesAsync}
                        onError={this.handleLoadingError}
                        onFinish={this.handleFinishLoading}
                    />
                </Container>
            )
        }
        return (
            <Container>
                <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
                <View style={styles.statusBar} />
                <Navigation />
            </Container>
        )
    }

    loadResourcesAsync = async () => {
        return Promise.all([
            Asset.fromModule(require('./assets/icons/loading-icon.png')).downloadAsync()
        ])
    }

    handleLoadingError = error => {
        console.warn(error)
    }

    handleFinishLoading = () => this.setState({ isLoadingComplete: true })
}

const styles = StyleSheet.create({
    statusBar: {
        backgroundColor: '#37474F',
        height: Constants.statusBarHeight
    }
})
