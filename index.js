import React from 'react';
import { Animated, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import Draggable from 'react-native-snap-drag';
import emojis from './emojis';

const window = Dimensions.get('window');
const size = 80;
export default class EmojiPicker extends React.Component {
  state = {
    picked: []
  };
  constructor(props) {
    super(props);
    this.animatedTop = new Animated.Value(-size);
  }
  componentWillReceiveProps({ isVisible }) {
    if (!isVisible && this.props.isVisible) {
      Animated.spring(this.animatedTop, {
        toValue: -size
      }).start();
    } else if (isVisible && !this.props.isVisible) {
      Animated.spring(this.animatedTop, {
        toValue: 0
      }).start();
    }
  }
  pick(emoji) {
    this.setState({
      picked: this.state.picked.concat({
        top: window.height / 2 - size,
        left: window.width / 2 - size / 2,
        size,
        emoji
      })
    });
  }
  render() {
    const { picked } = this.state;
    const { children, isVisible } = this.props;
    return (
      <View
        style={{
          flex: 1,
          overflow: 'hidden'
        }}
      >
        {children}
        {picked.map(({ left, top, size, emoji }, i) => (
          <Draggable
            key={'emoji-' + i}
            style={{
              position: 'absolute',
              left,
              top
            }}
          >
            <Text
              style={{
                backgroundColor: 'transparent',
                fontSize: size
              }}
            >
              {emoji}
            </Text>
          </Draggable>
        ))}
        <Animated.ScrollView
          horizontal
          style={{
            flex: 1,
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            left: 0,
            top: 0,
            right: 0,
            height: 80,
            transform: [
              {
                translateY: this.animatedTop
              }
            ]
          }}
          contentContainerStyle={{
            flexDirection: 'row'
          }}
        >
          {emojis.map(emoji => (
            <TouchableOpacity
              key={'emoji-' + emoji}
              onPress={this.pick.bind(this, emoji)}
              style={{
                height: 80,
                width: 80,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ fontSize: 50 }}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}
