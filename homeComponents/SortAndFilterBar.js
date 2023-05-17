import React, {useState} from 'react';
import {View, Text, Pressable, Animated} from 'react-native';
import Picker from '@ouroboros/react-native-picker';

import styles, {smoothChange} from '../styles';
import {Icon} from '../Icon';
import {Row, Col, Separator} from '../components';

export default function SortAndFilterBar({sortBy, setSortBy}) {
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  var filterMenuHeight = new Animated.Value(filterMenuVisible ? 200 : 0);

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
          <Pressable
            onPress={() => {
              handleFilterMenuToggle(
                filterMenuVisible,
                setFilterMenuVisible,
                filterMenuHeight,
              );
            }}>
            <Icon type="ant" name="filter" />
          </Pressable>
        </View>
      </View>
      <Separator />
      <FilterMenu filterMenuHeight={filterMenuHeight} />
    </>
  );
}

function handleFilterMenuToggle(toggleState, setToggleState, filterMenuHeight) {
  console.log('filter toggled');
  smoothChange(filterMenuHeight, toggleState ? 0 : 200, 200).start(
    ({finished}) => {
      setToggleState(!toggleState);
    },
  );
}

function FilterMenu({filterMenuHeight}) {
  return (
    <Animated.View
      style={[
        {
          height: filterMenuHeight,
          width: '100%',
        },
      ]}>
      <Row>
        <Col>
          <Text style={styles.textBasic}>Category</Text>
        </Col>
        <Col>
          <Text style={styles.textBasic}>Wallet</Text>
        </Col>
        <Col>
          <Text style={styles.textBasic}>Date</Text>
        </Col>
      </Row>
    </Animated.View>
  );
}
