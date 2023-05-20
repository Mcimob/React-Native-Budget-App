import React, {useEffect, useState} from 'react';
import {Text, Animated, View} from 'react-native';
import {getDBConnection, createTables, getItems} from './db';
import styles, {smoothChange} from './styles';
import {UpperRightEditButton, Separator} from './components';
import ToggleBar from './homeComponents/ToggleBar';
import SortAndFilterBar from './homeComponents/SortAndFilterBar';
import ItemDisplay from './homeComponents/ItemDisplay';
import {getCurrentMonthRange} from './utils';

let db = getDBConnection();

export default function HomeScreen({navigation}) {
  const [entries, setEntries] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [categories, setCategories] = useState(null);

  const [editState, setEditState] = useState(false);

  const [total, setTotal] = useState(0);

  const [toggleState, setToggleState] = useState(false);
  var togglePosition = new Animated.Value(toggleState ? 1 : 0);

  const [sortBy, setSortBy] = useState('none');

  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [walletsSelected, setWalletsSelected] = useState([]);

  const [excludeCategories, setExcludecategories] = useState(false);
  const [excludeWallets, setExcludeWallets] = useState(false);

  const [dateRange, setDateRange] = useState({
    title: 'Current Month',
    dateRange: getCurrentMonthRange(),
  });

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getItems(db, setEntries, 'entry');
      getItems(db, setWallets, 'wallet');
      getItems(db, setCategories, 'category');
    });
    return focusHandler;
  }, [navigation, entries]);

  useEffect(() => {
    if (entries) {
      let sum = 0;
      entries.forEach(item => (sum += item.amount));
      setTotal(sum);
    }
  }, [entries]);

  useEffect(() => {
    initializeSelectedArray(
      categoriesSelected,
      setCategoriesSelected,
      categories,
    );
  }, [categories]);

  useEffect(() => {
    initializeSelectedArray(walletsSelected, setWalletsSelected, wallets);
  }, [wallets]);

  useEffect(() => {
    createTables(db);
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <UpperRightEditButton state={editState} setState={setEditState} />
      ),
    });
  });

  return (
    <View style={[styles.homePage]}>
      <ToggleBar
        handleToggle={handleToggle}
        togglePosition={togglePosition}
        toggleState={toggleState}
        setToggleState={setToggleState}
      />
      <SortAndFilterBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        wallets={wallets}
        categoriesSelected={categoriesSelected}
        setCategoriesSelected={setCategoriesSelected}
        walletsSelected={walletsSelected}
        setWalletsSelected={setWalletsSelected}
        excludeCategories={excludeCategories}
        excludeWallets={excludeWallets}
        setExcludecategories={setExcludecategories}
        setExcludeWallets={setExcludeWallets}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <Separator />
      {entries && (
        <ItemDisplay
          togglePosition={togglePosition}
          toggleState={toggleState}
          entries={entries}
          sortBy={sortBy}
          navigation={navigation}
          wallets={wallets}
          categories={categories}
          editState={editState}
          setEntries={setEntries}
          categoriesSelected={categoriesSelected}
          walletsSelected={walletsSelected}
          categoriesExcluded={excludeCategories}
          walletsExcluded={excludeWallets}
          dateRange={dateRange}
        />
      )}
      <Separator />
      <View style={[styles.item, {alignSelf: 'center'}]}>
        <Text style={styles.textBasic}>Total:</Text>
        <Text style={styles.textBasic}>CHF {total}</Text>
      </View>
    </View>
  );
}

function handleToggle(toggleState, setToggleState, togglePosition) {
  smoothChange(togglePosition, toggleState ? 0 : 1, 500).start(({finished}) => {
    setToggleState(!toggleState);
  });
}

function initializeSelectedArray(selected, setSelected, items) {
  let idsUsed = selected.map(item => item.id);
  let newSelected = [];
  if (items) {
    for (let i = 0; i < items.length; i++) {
      let indexInArray = idsUsed.find(x => x == items[i].id);
      if (indexInArray) {
        newSelected.push({
          id: items[i].id,
          selected: selected[indexInArray],
        });
      } else {
        newSelected.push({
          id: items[i].id,
          selected: false,
        });
      }
    }
  }
  setSelected(newSelected);
}
