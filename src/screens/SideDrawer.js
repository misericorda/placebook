import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import {authLogout} from "../store/actions/auth"
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


const SideDrawer = props => (
  <View style={[styles.container, {width: Dimensions.get('window').width * 0.8}]}>
    <Text style={styles.drawerTitle}>Available actions</Text>
    <TouchableOpacity onPress={props.authLogout}>
      <View style={styles.drawerItem}>
        <Icon size={30}
              name={Platform.OS === 'android' ? 'md-log-out' : "ios-log-out"}
              color="#aaa"
              style={styles.drawerItemIcon}/>
        <Text>Log Out</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  drawerTitle: {
    marginBottom: 10,

  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee'
  },
  drawerItemIcon: {
    marginRight: 10
  },
  container: {
    paddingTop: 50,
    backgroundColor: 'white',
    flex: 1
  }
});


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    authLogout
  }, dispatch)
};

export default connect(null, mapDispatchToProps)(SideDrawer);

