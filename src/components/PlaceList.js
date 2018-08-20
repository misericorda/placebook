import React from 'react';

import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import ListItem from './ListItem';

const PlaceList = ({places, onItemSelected}) => {
  console.log(places);
  return (
    <FlatList
      data={places}
      style={styles.listContainer}
      renderItem={(info) => (
        <ListItem
          placeName={info.item.name}
          placeImage={info.item.image}
          onItemSelected={() => onItemSelected(info.item.key)}/>
      )}
    />)
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
  }
});

export default PlaceList;