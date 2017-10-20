import 'react-native'
import React from 'react'
import ResultModal from '../ResultModal'
import renderer from 'react-test-renderer'

test('should render correctly', () => {
    const tree = renderer.create(<ResultModal />).toJSON()
    expect(tree).toMatchSnapshot()
})
