import 'react-native'
import React from 'react'
import TouchableIcon from '../TouchableIcon'
import renderer from 'react-test-renderer'

test('should render correctly', () => {
    const tree = renderer.create(<TouchableIcon />).toJSON()
    expect(tree).toMatchSnapshot()
})
