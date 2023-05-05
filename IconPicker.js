import React, {useState} from 'react';
import {View, Pressable, Text, TextInput, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';
import {Icon, allIcons} from './Icon.js';

const fullIconList = allIcons();

export default function IconPicker({modalVisible, setModalVisible, setIcon}) {
  const [search, setSearch] = useState('');
  const [icons, setIcons] = useState(fullIconList);

  return (
    <Modal isVisible={modalVisible} hasBackdrop={false}>
      <View style={styles.modalView}>
        <Pressable
          style={[styles.roundedBox, styles.black, styles.whiteBorder]}
          onPress={() => {
            setModalVisible(false);
          }}>
          <Text style={styles.buttonText}>Close Iconpicker</Text>
        </Pressable>
        <TextInput
          style={[styles.roundedBox, styles.black, styles.whiteBorder]}
          placeholderTextColor="white"
          placeholder="Search..."
          onChangeText={newSearch =>
            updateIconList(newSearch, setSearch, setIcons)
          }
          defaultValue={search}
        />
        <Text style={[styles.buttonText, styles.subTitle]}>Icons</Text>
        <FlatList
          style={styles.iconList}
          data={icons}
          renderItem={({item}) => (
            <IconContainer
              icon={item}
              setIcon={setIcon}
              setModalVisible={setModalVisible}
            />
          )}
          numColumns={4}
          columnWrapperStyle={{justifyContent: 'space-between'}}
        />
      </View>
    </Modal>
  );
}

function updateIconList(search, setSearch, setIcons) {
  let icons = [];
  for (let s of fullIconList) {
    if (s.name.includes(search)) {
      icons.push(s);
    }
  }
  setSearch(search);
  setIcons(icons);
}

function submitIcon(icon, setIcon, setModalVisible) {
  setIcon(icon);
  setModalVisible(false);
}

function IconContainer({icon, setIcon, setModalVisible}) {
  return (
    <Pressable
      style={styles.iconContainer}
      onPress={() => submitIcon(icon, setIcon, setModalVisible)}>
      <Icon type={icon.source} name={icon.name} size={30} color="#fff" />
    </Pressable>
  );
}
