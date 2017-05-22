import React from 'react';
import { Animated, Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
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

  // show/hide animation
  componentWillReceiveProps({ isVisible }) {
    if (!isVisible && this.props.isVisible) {
      this.animateTo(-size);
    } else if (isVisible && !this.props.isVisible) {
      this.animateTo(0);
    }
  }

  animateTo(toValue) {
    Animated.spring(this.animatedTop, { toValue }).start();
  }

  // show picked emoji on the screen
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
      <View style={styles.container}>
        {children}
        {picked.map(({ left, top, size, emoji }, i) => (
          <Draggable key={'emoji-' + i} style={{ position: 'absolute', left, top }}>
            <Text style={styles.picked}>
              {emoji}
            </Text>
          </Draggable>
        ))}
        <Animated.ScrollView
          horizontal
          style={[styles.pickerList, { transform: [ { translateY: this.animatedTop } ] } ] }
          contentContainerStyle={{ flexDirection: 'row' }}
        >
          {emojis.map(emoji => (
            <TouchableOpacity
              key={'emoji-' + emoji}
              onPress={this.pick.bind(this, emoji)}
              style={styles.pickerItem}
            >
              <Text style={styles.pickerItemText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  picked: {
    backgroundColor: 'transparent',
    fontSize: size
  },
  pickerList: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    left: 0,
    top: 0,
    right: 0,
    height: 80,
  },
  pickerItem: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pickerItemText: {
    fontSize: 50
  }
});
