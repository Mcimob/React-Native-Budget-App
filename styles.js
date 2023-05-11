import {StyleSheet, Animated, Easing} from 'react-native';

const bright = '#43bdbf';
const dark = '#236061';

export const header_style = {
  headerStyle: {
    backgroundColor: 'black',
    borderBottomColor: bright,
    borderBottomWidth: 2,
  },
  headerTintColor: 'white',
};

export function smoothWidthChange(
  event,
  animWidth,
  animX,
  setWidth,
  setX,
  setBuildState,
) {
  setBuildState(true);
  var {x, y, width, height} = event.nativeEvent.layout;

  smoothChange(animWidth, width, 200).start(({finished}) => setWidth(width));
  smoothChange(animX, x, 200).start(({finished}) => setX(x));
}
export function smoothChange(animVal, to, duration) {
  return Animated.timing(animVal, {
    toValue: to,
    duration: duration,
    useNativeDriver: false,
    easing: Easing.linear,
  });
}

export default styles = StyleSheet.create({
  inputPage: {
    height: '100%',
    width: '100%',
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    zIndex: -100,
    elevation: -100,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBasic: {
    padding: 10,
    color: 'white',
  },
  buttonText: {
    padding: 10,
    color: 'white',
  },
  subTitle: {
    fontSize: 24,
  },
  inputBox: {
    margin: 10,
    width: 150,
    Color: 'black',
  },
  grid2: {
    flex: 4,
    marginHorizontal: 'auto',
    width: 'auto',
    minWidth: 300,
    backgroundColor: dark,
    borderColor: bright,
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  black: {
    backgroundColor: '#121212',
    color: 'white',
  },
  accentBorder: {
    borderColor: bright,
    borderWidth: 2,
  },
  '1col': {
    flex: 1,
  },
  '2col': {
    flex: 2,
  },
  '3col': {
    flex: 3,
  },
  '4col': {
    flex: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 10,
    justifyContent: 'center',
    //marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  flatList: {
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    height: '90%',
    backgroundColor: '#000d',
    borderRadius: 20,
    padding: 25,
    elevation: 1,
  },

  roundedBox: {
    padding: 10,
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
  },
  iconList: {
    overflow: 'scroll',
  },
  itemList: {
    width: 'auto',
    overflow: 'scroll',
    padding: 20,
    flexGrow: 0,
  },
  itemListBackground: {
    position: 'absolute',
    padding: 20,
    backgroundColor: dark,
    borderRadius: 25,
    borderColor: bright,
    borderWidth: 2,
    elevation: -1,
    zIndex: -1,
    height: '100%',
  },
  item: {
    width: 250,
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: bright,
    borderWidth: 2,
  },

  buttonHover: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
  },
  buttonHoverText: {
    color: 'black',
  },
  deleteIcon: {
    padding: 10,
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#43bdbf',
    bottom: 30,
    right: 30,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonBar: {
    backgroundColor: '#00f',
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 30,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonEffect: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: bright,
    elevation: 1,
  },
  modalItemList: {
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
  },
  dark: {backgroundColor: dark},
  homePage: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});
