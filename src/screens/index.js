import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';

export const startMainTabs = () => {
  Promise.all([
    Icon.getImageSource(Platform.OS === 'android' ? 'md-journal' : 'ios-journal', 30),
    Icon.getImageSource(Platform.OS === 'android' ? 'md-aperture' : 'ios-aperture', 30),
    Icon.getImageSource(Platform.OS === 'android' ? 'md-menu' : 'ios-menu', 30),
    Icon.getImageSource(Platform.OS === 'android' ? 'md-information-circle' : 'ios-information-circle', 30)
  ])
    .then(
      sources => {
        Navigation.setRoot({
          root: {
            sideMenu: {
              left: {
                component: {
                  name: 'placebook.SideDrawer',
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
                            name: 'placebook.FindPlace',
                            id: 'placebook.FindPlaceScreen',
                            passProps: {lb: sources[2], bb: sources[0]}
                          }
                        }],
                      }
                    },
                    {
                      stack: {
                        children: [{
                          component: {
                            name: 'placebook.SharePlace',
                            id: 'placebook.SharePlaceScreen',
                            passProps: {lb: sources[2], bb: sources[1]}
                          }
                        }],
                      }
                    },
                    {
                      component: {
                        name: 'placebook.About',
                        id: 'placebook.AboutScreen',
                        passProps: {lb: sources[2], bb: sources[3]}
                      }
                    }
                  ],
                  options: {
                    bottomTabs: {},
                  }
                },
              },
            },
          },
        });
      }
    )
};

export const startLoginScreen = () => Navigation.setRoot({
  root: {
    component: {
      name: 'placebook.AuthScreen',
    }
  }
});
