import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';

const startTabs = () => {
  Promise.all([
    Icon.getImageSource(Platform.OS === 'android' ? 'md-map' : 'ios-map', 30),
    Icon.getImageSource(Platform.OS === 'android' ? 'md-share-alt' : 'ios-share-alt', 30),
    Icon.getImageSource(Platform.OS === 'android' ? 'md-menu' : 'ios-menu', 30)
  ]).then(
    sources => {
      Navigation.setRoot({
        root: {
          sideMenu: {
            left: {
              component: {
                name: 'memento.SideDrawer',
                id: 'leftSideDrawer'
              },
            },
            center: {
              bottomTabs: {
                children: [
                  {
                    stack: {
                      children: [{
                        component: {
                          name: 'memento.FindPlace',
                          id: 'memento.FindPlaceScreen'
                        }
                      }],
                      options: {
                        topBar: {
                          visible: true,
                          title: {
                            text: 'Find Place'
                          },
                          leftButtons: [
                            {
                              id: 'openLeftDrawer',
                              icon: sources[2],
                              iconColor: 'orange'
                            }
                          ]
                        },
                        bottomTab: {
                          title: 'Find Place',
                          icon: sources[0],
                        }
                      }
                    }
                  },
                  {
                    stack: {
                      children: [{
                        component: {
                          name: 'memento.SharePlace',
                        }
                      }],
                      options: {
                        topBar: {
                          visible: true,
                          title: {
                            text: 'Share Place'
                          },
                          leftButtons: [
                            {
                              id: 'openLeftDrawer',
                              icon: sources[2]
                            }
                          ]
                        },
                        bottomTab: {
                          title: 'Share Place',
                          icon: sources[1],
                        }
                      }
                    }
                  }
                ],
                options: {
                  bottomTabs: {
                    // titleDisplayMode: 'alwaysShow',
                    // fontFamily: 'HelveticaNeue-Italic',
                    // fontSize: 13,
                    selectedTabColor: 'orange'
                    // unselectedTabColor: 'red',
                    // tabColor: 'blue',
                    // selectedTabColor: 'red',
                    // currentTabIndex: 1,
                    // visible: false,
                    // drawBehind: true,
                    // animate: true,
                    // tabColor: 'blue',
                    // selectedTabColor: 'red'
                  },
                }
              },

            },
          },
        },
      });
    }
  )
};

export default startTabs;
