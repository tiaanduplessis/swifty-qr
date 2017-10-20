import React from 'react'
import {TouchableOpacity} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const TouchableIcon = ({ margin, containerStyle, onPress, size, name, color, ...otherProps }) => (
    <TouchableOpacity style={[{ margin }, containerStyle]} onPress={onPress}>
        <MaterialCommunityIcons size={size} name={name} color={color} />
    </TouchableOpacity>
)

TouchableIcon.defaultProps = {
    containerStyle: {},
    margin: 0,
    size: 22,
    name: '',
    color: '#111'
}

export default TouchableIcon