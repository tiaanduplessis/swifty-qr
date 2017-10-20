import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Clipboard,
    Share,
    Alert,
    RefreshControl
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import storage from 'react-native-modest-storage'
import Container from 'nanokit-container'
import { isUri } from 'valid-url'

import TouchableIcon from '../components/TouchableIcon'

import config from '../constants/config'
import colors from '../constants/colors'

import { openURL } from '../utils'

class HistoryScreen extends PureComponent {
    state = {
        items: [],
        refreshing: false
    }

    async componentDidMount() {
        await this.getHistory()
    }

    render() {
        const { items, refreshing } = this.state

        return (
            <Container backgroundColor={colors.offWhite}>
                <FlatList
                    data={items}
                    renderItem={this.renderRow}
                    refreshControl={
                        <RefreshControl
                            colors={[colors.primary, colors.secondary]}
                            refreshing={refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                />
            </Container>
        )
    }

    handleRefresh = async () => {
        this.setState({ refreshing: true })
        await this.getHistory()
        this.setState({ refreshing: false })
    }

    renderRow = ({ item }) => {
        const { type, data } = item
        let iconName = 'qrcode'
        let actionIcon = 'share'

        if (isUri(data)) {
            iconName = 'web'
            actionIcon = 'link'
        }

        return (
            <View style={styles.rowContainer}>
                <MaterialCommunityIcons size={20} name={iconName} color={colors.primary} />
                <Text numberOfLines={1} style={styles.dataText}>
                    {data}
                </Text>
                <View style={styles.buttonsContainer}>
                    <TouchableIcon
                        size={20}
                        containerStyle={styles.actionContainer}
                        onPress={() => this.handleCopyToClipboard(data)}
                        name={'content-copy'}
                        color={colors.primary}
                    />

                    <TouchableIcon
                        size={20}
                        containerStyle={styles.actionContainer}
                        onPress={() => {
                            if (isUri(data)) {
                                this.handleOpenLink(data)
                            }

                            this.handleShare(data)
                        }}
                        name={actionIcon}
                        color={colors.primary}
                    />
                </View>
            </View>
        )
    }

    getHistory = async () => {
        const items = (await storage.get(config.historyKey)) || []
        const keyedItems = items.map((item, index) => {
            item.key = index
            return item
        })
        this.setState({ items: keyedItems.reverse() })
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
    rowContainer: {
        backgroundColor: colors.white,
        flex: 1,
        height: 55,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 1,
        padding: 10
    },
    dataText: { color: colors.black, fontSize: 16, flex: 1, textAlign: 'center' },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionContainer: { marginHorizontal: 10 }
})

export default HistoryScreen
