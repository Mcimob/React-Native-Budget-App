import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  FlatList,
  ScrollView,
} from 'react-native';
import Picker from '@ouroboros/react-native-picker';
import Switch from 'react-native-switch-toggles';

import styles, {smoothChange, dark} from '../styles';
import {Icon} from '../Icon';
import {Row, Col, Separator} from '../components';
import {
  getCurrentMonthRange,
  getCurrentWeekRange,
  subtractMonths,
} from '../utils';

export default function SortAndFilterBar({
  sortBy,
  setSortBy,
  categories,
  wallets,
  categoriesSelected,
  setCategoriesSelected,
  walletsSelected,
  setWalletsSelected,
  excludeCategories,
  setExcludecategories,
  excludeWallets,
  setExcludeWallets,
  dateRange,
  setDateRange,
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
        excludeCategories={excludeCategories}
        setExcludecategories={setExcludecategories}
        excludeWallets={excludeWallets}
        setExcludeWallets={setExcludeWallets}
        dateRange={dateRange}
        setDateRange={setDateRange}
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
  excludeCategories,
  setExcludecategories,
  excludeWallets,
  setExcludeWallets,
  dateRange,
  setDateRange,
}) {
  return (
    <Animated.View
      style={{
        height: togglePosition.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 200],
        }),
      }}>
      <ScrollView>
        <Row>
          <Col style={{alignSelf: 'flex-start'}}>
            <Text style={styles.textBasic}>Category</Text>

            <ExcludeSwitch
              exclude={excludeCategories}
              setExclude={setExcludecategories}
            />
            {categories &&
              categories.map((item, index) => (
                <FilterItem
                  item={item}
                  index={index}
                  currentlySelected={categoriesSelected}
                  setCurrentlySelected={setCategoriesSelected}
                  exclude={excludeCategories}
                />
              ))}
          </Col>
          <Col style={{alignSelf: 'flex-start'}}>
            <Text style={styles.textBasic}>Wallet</Text>
            <ExcludeSwitch
              exclude={excludeWallets}
              setExclude={setExcludeWallets}
            />
            {wallets &&
              wallets.map((item, index) => (
                <FilterItem
                  item={item}
                  index={index}
                  currentlySelected={walletsSelected}
                  setCurrentlySelected={setWalletsSelected}
                  exclude={excludeWallets}
                />
              ))}
          </Col>
          <Col style={{alignSelf: 'flex-start'}}>
            <Text style={styles.textBasic}>Date</Text>
            {[
              {
                title: 'Past 3 Months',
                dateRange: [subtractMonths(new Date(), 3), new Date()],
              },
              {
                title: 'Past year',
                dateRange: [subtractMonths(new Date(), 12), new Date()],
              },
              {title: 'Current week', dateRange: getCurrentWeekRange()},
              {title: 'Current Month', dateRange: getCurrentMonthRange()},
            ].map(item => (
              <DateFilterItem
                item={item}
                currentlySelected={dateRange}
                setCurrentlySelected={setDateRange}
              />
            ))}
          </Col>
        </Row>
      </ScrollView>
    </Animated.View>
  );
}

function ExcludeSwitch({exclude, setExclude}) {
  return (
    <View style={{margin: 5}}>
      <Switch
        size={40}
        value={exclude}
        onChange={value => setExclude(value)}
        activeTrackColor="tomato"
        inactiveTrackColor={dark}
        renderOffIndicator={() => (
          <Text style={[styles.textBasic, {padding: 0}]}>Incl.</Text>
        )}
        renderOnIndicator={() => (
          <Text style={[styles.textBasic, {padding: 0}]}>Excl.</Text>
        )}
      />
    </View>
  );
}

function handleFilterMenuToggle(toggleState, setToggleState, filterMenuHeight) {
  smoothChange(filterMenuHeight, toggleState ? 0 : 1, 200).start(
    ({finished}) => {
      setToggleState(!toggleState);
    },
  );
}

function FilterItem({
  item,
  index,
  currentlySelected,
  setCurrentlySelected,
  exclude,
}) {
  const [animColor, setAnimColor] = useState(
    new Animated.Value(exclude ? 1 : 0),
  );

  const [bgColor, setBgColor] = useState(
    new Animated.Value(
      index < currentlySelected.length && currentlySelected[index].selected
        ? 1
        : 0,
    ),
  );

  useEffect(() => {
    if (index < currentlySelected.length) {
      smoothChange(
        bgColor,
        currentlySelected[index].selected ? 1 : 0,
        200,
      ).start();
    }
  }, [currentlySelected]);

  useEffect(() => {
    smoothChange(animColor, exclude ? 1 : 0, 200).start();
  }, [exclude]);

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
        style={{
          backgroundColor: animColor.interpolate({
            inputRange: [0, 1],
            outputRange: [dark, 'tomato'],
          }),
          margin: 5,
        }}>
        <Animated.View
          style={[
            styles.row,
            styles.center,
            styles.pad10,
            styles.accentBorder,
            {
              backgroundColor: bgColor.interpolate({
                inputRange: [0, 1],
                outputRange: ['#121212ff', '#12121200'],
              }),
            },
          ]}>
          <Text style={[styles.textBasic, {padding: 0}]}>{item.title}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

function DateFilterItem({item, currentlySelected, setCurrentlySelected}) {
  const [bgColor, setBgColor] = useState(
    new Animated.Value(currentlySelected.title == item.title ? 1 : 0),
  );

  useEffect(() => {
    smoothChange(
      bgColor,
      currentlySelected.title == item.title ? 1 : 0,
      200,
    ).start();
  }, [currentlySelected]);

  return (
    <Pressable
      onPress={() => {
        setCurrentlySelected(item);
      }}>
      <Animated.View
        style={[
          styles.row,
          styles.center,
          styles.pad10,
          styles.accentBorder,
          {
            backgroundColor: bgColor.interpolate({
              inputRange: [0, 1],
              outputRange: ['#121212', dark],
            }),
            margin: 5,
          },
        ]}>
        <Text style={[styles.textBasic, {padding: 0}]}>{item.title}</Text>
      </Animated.View>
    </Pressable>
  );
}
