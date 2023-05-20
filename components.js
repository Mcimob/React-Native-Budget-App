import React from 'react';
import {View, Pressable, TextInput, Animated} from 'react-native';
import styles from './styles';
import {Icon} from './Icon';

export function Col({numRows = 2, children, ...args}) {
  return (
    <View style={styles[`${numRows}col`]} {...args}>
      {children}
    </View>
  );
}

export function Row({children, ...args}) {
  return (
    <View style={[styles.row, styles.center]} {...args}>
      {children}
    </View>
  );
}

export function CustomTextInput({placeholder, text, setText, ...props}) {
  return (
    <TextInput
      style={[styles.roundedBox, styles.black, styles.accentBorder]}
      placeholder={placeholder}
      placeholderTextColor="#999"
      onChangeText={newText => setText(newText)}
      value={text}
      {...props}
    />
  );
}

export function UpperRightEditButton({state, setState}) {
  return (
    <Pressable onPress={() => setState(!state)} style={styles.pad10}>
      <Icon type="ant" name="edit" size={30} color="#fff" />
    </Pressable>
  );
}

export function Separator() {
  return <View style={{height: 1, width: '100%', backgroundColor: 'white'}} />;
}

export function MinusButton({handleDelete, item, setEntries, db, ...props}) {
  return (
    <Pressable onPress={() => handleDelete(item, setEntries, db)} {...props}>
      <Icon
        style={styles.deleteIcon}
        type="ant"
        name="minuscircle"
        size={20}
        color="#fff"
      />
    </Pressable>
  );
}

export function EditButton({handleEdit, item, navigation, ...props}) {
  return (
    <Pressable
      onPress={() => {
        handleEdit(item, navigation);
        console.log('edit');
      }}
      {...props}>
      <Icon
        style={styles.deleteIcon}
        type="ant"
        name="edit"
        size={20}
        color="#fff"
      />
    </Pressable>
  );
}

export function ViewAnimatedOpacity({children, animVal, ...props}) {
  return <Animated.View style={{opacity: animVal}}>{children}</Animated.View>;
}
