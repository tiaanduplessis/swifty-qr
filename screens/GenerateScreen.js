import React, { PureComponent } from 'react'
import { View, StyleSheet, Button, CameraRoll, Alert } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import Container from 'nanokit-container'
import { takeSnapshotAsync } from 'expo'
import QRCode from 'react-native-qrcode-svg'

import colors from '../constants/colors'

import { log } from '../utils'

class GenerateScreen extends PureComponent {
    state = {
        value: '',
        isFocused: false,
        savedCode: false
    }

    render() {
        const { value, isFocused, savedCode } = this.state

        return (
            <Container backgroundColor={colors.offWhite} padding={10}>
                <TextField
                    ref={this.setRef}
                    onFocus={this.handleOnFocus}
                    onBlur={this.handleOnBlur}
                    fontSize={20}
                    baseColor={colors.gray}
                    label="Text to encode"
                    value={value}
                    onChangeText={this.handleTextChange}
                    multiline
                    textColor={colors.primary}
                    tintColor={colors.secondary}
                    containerStyle={styles.inputContainer}
                />
                <View
                    style={styles.qrContainer}
                    ref={ref => {
                        this.container = ref
                    }}
                >
                    {!isFocused ? (
                        <QRCode value={value || 'placeholder'} size={280} color={colors.primary} />
                    ) : (
                        <Button
                            onPress={this.handleGenerate}
                            title="GENERATE"
                            color={colors.secondary}
                        />
                    )}
                </View>
            </Container>
        )
    }

    handleSaveImage = async () => {
        // TODO:
        // Wait for https://github.com/expo/expo/issues/624 to be resolved to implement feature
        try {
            const img = await takeSnapshotAsync(this.container, {
                format: 'png',
                quality: 1,
                result: 'file' // 'base64'
            })
            log.info(img)
            CameraRoll.saveToCameraRoll(img, 'photo')
            this.setState({ savedCode: true })
            Alert.alert('Done!', 'The QR code has been saved to your device.')
        } catch (error) {
            log.error(error)
            Alert.alert('Oops!', 'We couldn\'t save the image at this time.')
        }
    }

    setRef = ref => {
        this.textField = ref
    }

    handleTextChange = value => this.setState({ value })

    handleOnFocus = () => this.setState({ isFocused: true })

    handleOnBlur = () => this.setState({ isFocused: false })

    handleGenerate = () => {
        this.textField.blur()
        this.setState({ savedCode: false })
    }
}

const styles = StyleSheet.create({
    inputContainer: { width: '70%', alignSelf: 'center' },
    qrContainer: {
        backgroundColor: colors.offWhite,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100
    }
})

export default GenerateScreen
