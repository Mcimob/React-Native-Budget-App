import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OcticonIcon from 'react-native-vector-icons/Octicons';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import FeatherDict from 'react-native-vector-icons/glyphmaps/Feather.json';
import IoniconDict from 'react-native-vector-icons/glyphmaps/Ionicons.json';
import ZocialIconDict from 'react-native-vector-icons/glyphmaps/Zocial.json';
import EntypoIconDict from 'react-native-vector-icons/glyphmaps/Entypo.json';
import FontistoDict from 'react-native-vector-icons/glyphmaps/Fontisto.json';
import EvilIconDict from 'react-native-vector-icons/glyphmaps/EvilIcons.json';
import FAIconDict from 'react-native-vector-icons/glyphmaps/FontAwesome.json';
import AntDesignDict from 'react-native-vector-icons/glyphmaps/AntDesign.json';
import OcticonIconDict from 'react-native-vector-icons/glyphmaps/Octicons.json';
import FAIcon5Dict from 'react-native-vector-icons/glyphmaps/FontAwesome5Free.json';
import FoundationIconDict from 'react-native-vector-icons/glyphmaps/Foundation.json';
import MaterialIconDict from 'react-native-vector-icons/glyphmaps/MaterialIcons.json';
import SimpleLineIconDict from 'react-native-vector-icons/glyphmaps/SimpleLineIcons.json';
import MaterialCommunityIconDict from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

const typeLookup = {
  fontisto: Fontisto,
  material: MaterialIcon,
  evil: EvilIcon,
  feather: Feather,
  ant: AntDesign,
  zocial: ZocialIcon,
  simpleLine: SimpleLineIcon,
  foundation: FoundationIcon,
  fa5: FAIcon5,
  fa: FAIcon,
  ionicon: Ionicon,
  materialCommunity: MaterialCommunityIcon,
  entypo: EntypoIcon,
  octicon: OcticonIcon,
};

const dicLookup = {
  fontisto: FontistoDict,
  material: MaterialIconDict,
  evil: EvilIconDict,
  feather: FeatherDict,
  ant: AntDesignDict,
  zocial: ZocialIconDict,
  simpleLine: SimpleLineIconDict,
  foundation: FoundationIconDict,
  fa5: FAIcon5Dict,
  fa: FAIconDict,
  ionicon: IoniconDict,
  materialCommunity: MaterialCommunityIconDict,
  entypo: EntypoIconDict,
  octicon: OcticonIconDict,
};

function getIcon(type) {
  return typeLookup[type];
}

const Icon = ({type, ...props}) => {
  const FontIcon = getIcon(type);

  return <FontIcon {...props} />;
};

function allIcons() {
  let allMaps = [
    FeatherDict,
    IoniconDict,
    ZocialIconDict,
    EntypoIconDict,
    FontistoDict,
    EvilIconDict,
    FAIconDict,
    AntDesignDict,
    OcticonIconDict,
    FAIcon5Dict,
    FoundationIconDict,
    MaterialIconDict,
    SimpleLineIconDict,
    MaterialCommunityIconDict,
  ];
  let out = [];
  for (let dic of allMaps) {
    for (let key of Object.keys(dic)) {
      out.push({
        name: key,
        source: getKeyByValue(dicLookup, dic),
      });
    }
  }
  return out;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] == value);
}

export {Icon, allIcons};
