import React, { PureComponent } from 'react'
import { View, StyleSheet, Button } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import Container from 'nanokit-container'
import QRCode from 'react-native-qrcode-svg'

import colors from '../constants/colors'

class GenerateScreen extends PureComponent {
    state = {
        value: '',
        isFocused: false
    }

    render() {
        const { value, isFocused } = this.state

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
                <View style={styles.qrContainer}>
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

    setRef = ref => {
        this.textField = ref
    }

    handleTextChange = value => this.setState({ value })

    handleOnFocus = () => this.setState({ isFocused: true })

    handleOnBlur = () => this.setState({ isFocused: false })

    handleGenerate = () => {
        this.textField.blur()
    }
}

const styles = StyleSheet.create({
    inputContainer: { width: '70%', alignSelf: 'center' },
    qrContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100
    }
})

export default GenerateScreen
