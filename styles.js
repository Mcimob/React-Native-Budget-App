import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
  inputPage: {
    height: '90%',
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBasic: {
    padding: 10,
    color: 'black',
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
  },
  grid2: {
    flex: 4,
    marginHorizontal: 'auto',
    width: 'auto',
    minWidth: 300,
  },
  black: {
    backgroundColor: 'black',
    color: 'white',
  },
  whiteBorder: {
    borderColor: 'white',
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
    margin: 5,
    justifyContent: 'center',
    marginTop: 20,
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
  },

  roundedBox: {
    padding: 10,
    borderRadius: 10,
    margin: 15,
  },
  iconList: {
    overflow: 'scroll',
  },
});
