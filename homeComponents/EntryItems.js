import React from 'react';
import {View, Text, Alert} from 'react-native';

import {EditButton, MinusButton, Row, Col} from '../components';
import styles from '../styles';
import {Icon} from '../Icon';
import {getItemById, dateTimeToDate} from '../utils';
import {removeItem, getItems} from '../db';

export function EntryItem(
  {navigation, item},
  wallets,
  categories,
  editState,
  setEntries,
  toggleState,
  db,
) {
  return (
    <View style={[styles.row, styles.center, {paddingVertical: 5}]}>
      {editState && (
        <View>
          <EditButton
            handleEdit={handleEdit}
            item={item}
            navigation={navigation}
            disabled={toggleState}
          />
        </View>
      )}
      <Row style={[styles.item, {width: '80%'}]}>
        <Col>
          <Text style={[styles.textBasic]}>{item.title}</Text>
        </Col>
        <Col>
          <Text style={[styles.textBasic, styles.greyedOutColor]}>
            {dateTimeToDate(item.dateAdded)}
          </Text>
        </Col>
        <Col>
          <Text style={styles.textBasic}>CHF {item.amount}</Text>
        </Col>
      </Row>
      {editState && (
        <View>
          <MinusButton
            handleDelete={handleDelete}
            item={item}
            setEntries={setEntries}
            disabled={toggleState}
            db={db}
          />
        </View>
      )}
    </View>
  );
}

export function GridEntryItemContainer(
  {navigation, item},
  wallets,
  categories,
  editState,
  setEntries,
  toggleState,
  db,
) {
  let wallet_0 = getItemById(wallets, item[0].wallet_id);
  let wallet_1 = item[1] ? getItemById(wallets, item[1].wallet_id) : null;
  let category_0 = getItemById(categories, item[0].category_id);
  let category_1 = item[1]
    ? getItemById(categories, item[0].category_id)
    : null;
  if (item[1]) {
    return (
      <View style={styles.row}>
        <GridEntryItem
          navigation={navigation}
          item={item[0]}
          wallet={wallet_0}
          category={category_0}
          editState={editState}
          setEntries={setEntries}
          toggleState={toggleState}
          db={db}
        />
        <GridEntryItem
          navigation={navigation}
          item={item[1]}
          wallet={wallet_1}
          category={category_1}
          editState={editState}
          setEntries={setEntries}
          toggleState={toggleState}
          db={db}
        />
      </View>
    );
  }
  return (
    <GridEntryItem
      navigation={navigation}
      item={item[0]}
      wallet={wallet_0}
      category={category_0}
      editState={editState}
      setEntries={setEntries}
      toggleState={toggleState}
      db={db}
    />
  );
}

function GridEntryItem({
  navigation,
  item,
  wallet,
  category,
  editState,
  setEntries,
  toggleState,
  db,
}) {
  return (
    <View
      style={[
        styles.accentBorder,
        styles.roundedBox,
        styles.itemGridBox,
        styles.black,
      ]}>
      <View
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 5,
            height: 10,
          },
        ]}>
        <View style={[{opacity: editState ? 1 : 0}, styles.editButtonGrid]}>
          <EditButton
            handleEdit={handleEdit}
            item={item}
            navigation={navigation}
            disabled={!toggleState}
          />
        </View>
        <View style={[{opacity: editState ? 1 : 0}, styles.minusButtonGrid]}>
          <MinusButton
            handleDelete={handleDelete}
            item={item}
            setEntries={setEntries}
            disabled={!toggleState}
            db={db}
          />
        </View>
      </View>
      <Text style={[styles.textBasic, {textAlign: 'center', padding: 0}]}>
        {item.title}
      </Text>
      <View style={styles.row}>
        {wallet && category && (
          <View style={styles.row}>
            <Icon type={wallet.icon_source} name={wallet.icon_name} />
            <Icon type={category.icon_source} name={category.icon_name} />
          </View>
        )}
        <Text style={styles.textBasic}>CHF {item.amount}</Text>
      </View>
      <View style={[styles.row, {justifyContent: 'flex-end', width: '100%'}]}>
        <Text
          style={[
            styles.textBasic,
            styles.greyedOutColor,
            {paddingVertical: 0},
          ]}>
          {dateTimeToDate(item.dateAdded)}
        </Text>
      </View>
    </View>
  );
}

function handleEdit(item, navigation) {
  navigation.navigate('ConfigEntry', {item});
}

function handleDelete(item, setter, db) {
  Alert.alert(
    'Delete',
    'Are you sure, you want to delete ' + item.title + '?',
    [
      {
        text: 'Yes',
        onPress: () => {
          removeItem(item.id, db, 'entry');
          getItems(db, setter, 'entry');
        },
      },
      {
        text: 'No',
        onPress: () => {},
      },
    ],
  );
}
