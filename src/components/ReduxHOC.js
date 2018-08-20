import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Navigation} from 'react-native-navigation'

function reduxHOC(Scene, store) {
  return class extends Component {
    options() {
      return {...(Scene.options || {})}
    }

    constructor(props, context) {
      super(props, context)
    }

    resendEvent = (eventName, params) => {
      if (this.instance && this.instance[eventName]) {
        this.instance[eventName](params)
      }
    }

    componentDidMount() {
      console.log('did mount')
      if (this.refs && this.refs.child) {
        if (this.refs.child.getWrappedInstance) {
          this.instance = this.refs.child.getWrappedInstance()
        } else {
          this.instance = this.refs.child
        }
      }
      // if (this.instance.onHardwareBackPress) {
      //   BackHandler.addEventListener('hardwareBackPress', this.instance.onHardwareBackPress)
      // }
    }

    componentWillUnmount() {
      // if (this.instance.onHardwareBackPress) {
      //   BackHandler.removeEventListener('hardwareBackPress', this.instance.onHardwareBackPress)
      // }
    }

    componentWillAppear() {
      console.log('Will appear')
    }
    componentDidAppear() {
      console.log('Didi appear')
      this.resendEvent('componentDidAppear')
    }

    componentDidDisappear() {
      this.resendEvent('componentDidDisappear')
    }

    onNavigationButtonPressed(eventId) {
      this.resendEvent('onNavigationButtonPressed', eventId)
      if (eventId === 'back') {
        Navigation.pop(this.props.componentId, {})
      } else if (eventId === 'close') {
        Navigation.dismissModal(this.props.componentId)
      } else {
        if (this.instance && this.instance[eventId]) {
          this.instance[eventId]()
        }
      }
    }

    render() {
      return (
        <Provider store={store}>
          <Scene ref="child" {...this.props} />
        </Provider>
      )
    }
  }
}

export default reduxHOC