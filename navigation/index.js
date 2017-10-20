import React, { PureComponent } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'
import { ScanScreen, GenerateScreen, HistoryScreen } from '../screens'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

import colors from '../constants/colors'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
}

class Navigation extends PureComponent {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Scan' },
      { key: '2', title: 'Generate' },
      { key: '3', title: 'History' }
    ]
  }

  handleIndexChange = index => this.setState({ index })

  renderHeader = props => (
    <TabBar
      style={{ backgroundColor: colors.primary }}
      indicatorStyle={{ backgroundColor: colors.white }}
      renderIcon={this.renderIcon}
      {...props}
    />
  )

  renderIcon = ({ focused, index }) => {
    const color = focused ? colors.white : colors.offWhite

    switch (index) {
      case 0:
        return (
          <MaterialCommunityIcons size={22} color={color} name='qrcode-scan' />
        )
      case 1:
        return <MaterialIcons size={22} color={color} name='create' />
      case 2:
        return <MaterialCommunityIcons size={22} color={color} name='history' />
    }
  }

  renderScene = SceneMap({
    '1': ScanScreen,
    '2': GenerateScreen,
    '3': HistoryScreen
  })

  render () {
    return <TabViewAnimated initialLayout={initialLayout} style={styles.container} navigationState={this.state} renderScene={this.renderScene} renderHeader={this.renderHeader} onIndexChange={this.handleIndexChange} />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default Navigation
