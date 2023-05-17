import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, Animated, FlatList} from 'react-native';
import Picker from '@ouroboros/react-native-picker';

import styles, {smoothChange, dark} from '../styles';
import {Icon} from '../Icon';
import {Row, Col, Separator} from '../components';

export default function SortAndFilterBar({
  sortBy,
  setSortBy,
  categories,
  wallets,
  categoriesSelected,
  setCategoriesSelected,
  walletsSelected,
  setWalletsSelected,
}) {
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  var togglePosition = new Animated.Value(filterMenuVisible ? 1 : 0);

  return (
    <>
      <View
        style={[styles.row, styles.pad10, {justifyContent: 'space-between'}]}>
        <View style={[styles.row, styles.center]}>
          <Text style={[styles.textBasic]}>Sort by:</Text>
          <Picker
            onChanged={setSortBy}
            options={[
              {value: 'none', text: 'None'},
              {value: 'wallet', text: 'Wallet'},
              {value: 'category', text: 'Category'},
            ]}
            value={sortBy}
            style={[
              styles.roundedBox,
              styles.accentBorder,
              styles.black,
              styles.pad10,
              {width: 100},
            ]}
          />
        </View>
        <View style={[styles.row, styles.center]}>
          <Text style={[styles.textBasic]}>Filter:</Text>
          <View>
            <Animated.View
              style={[styles.filterBackground, {opacity: togglePosition}]}
            />
            <Pressable
              onPress={() => {
                handleFilterMenuToggle(
                  filterMenuVisible,
                  setFilterMenuVisible,
                  togglePosition,
                );
              }}>
              <Icon type="ant" name="filter" />
            </Pressable>
          </View>
        </View>
      </View>
      <Separator />
      <FilterMenu
        togglePosition={togglePosition}
        categories={categories}
        wallets={wallets}
        categoriesSelected={categoriesSelected}
        setCategoriesSelected={setCategoriesSelected}
        walletsSelected={walletsSelected}
        setWalletsSelected={setWalletsSelected}
      />
    </>
  );
}

function FilterMenu({
  togglePosition,
  categories,
  wallets,
  categoriesSelected,
  setCategoriesSelected,
  walletsSelected,
  setWalletsSelected,
}) {
  return (
    <Animated.View
      style={[
        {
          height: togglePosition.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }),
        },
      ]}>
      <Row>
        <Col>
          <Text style={styles.textBasic}>Category</Text>
          <FlatList
            data={categories}
            renderItem={({item, index}) => (
              <FilterItem
                item={item}
                index={index}
                currentlySelected={categoriesSelected}
                setCurrentlySelected={setCategoriesSelected}
              />
            )}
          />
        </Col>
        <Col>
          <Text style={styles.textBasic}>Wallet</Text>
          <FlatList
            data={wallets}
            renderItem={({item, index}) => (
              <FilterItem
                item={item}
                index={index}
                currentlySelected={walletsSelected}
                setCurrentlySelected={setWalletsSelected}
              />
            )}
          />
        </Col>
        <Col>
          <Text style={styles.textBasic}>Date</Text>
        </Col>
      </Row>
    </Animated.View>
  );
}

function handleFilterMenuToggle(toggleState, setToggleState, filterMenuHeight) {
  smoothChange(filterMenuHeight, toggleState ? 0 : 1, 200).start(
    ({finished}) => {
      setToggleState(!toggleState);
    },
  );
}

function FilterItem({item, index, currentlySelected, setCurrentlySelected}) {
  const [animColor, setAnimColor] = useState(
    new Animated.Value(
      index < currentlySelected.length && currentlySelected[index].selected
        ? 1
        : 0,
    ),
  );

  useEffect(() => {
    if (index < currentlySelected.length) {
      smoothChange(
        animColor,
        currentlySelected[index].selected ? 1 : 0,
        200,
      ).start();
    }
  }, [currentlySelected]);

  return (
    <Pressable
      onPress={() => {
        const newSelected = currentlySelected.map((value, i) => {
          if (i == index) {
            let out = value;
            out.selected = !out.selected;
            return out;
          }
          return value;
        });
        setCurrentlySelected(newSelected);
      }}>
      <Animated.View
        style={[
          styles.row,
          styles.center,
          styles.filterItem,
          styles.accentBorder,
          {
            backgroundColor: animColor.interpolate({
              inputRange: [0, 1],
              outputRange: ['#121212', dark],
            }),
          },
        ]}>
        <View style={{width: '80%'}}>
          <Text style={[styles.textBasic, {padding: 0}]}>{item.title}</Text>
        </View>
        <Pressable>
          <Icon type="entypo" name="cross" />
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}
