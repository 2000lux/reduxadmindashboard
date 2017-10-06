import React, {Component} from 'react'
import { connect } from 'react-redux';
import { removeFlashMessage, markAsViewed } from '../actions'
import FlashMessages from '../components'

const mapStateToProps = (store, props) => {  
  return {
    ...props,
    messages: store.flashMessages
  };
}
 
const mapDispatchToProps = dispatch => {

  return {
    markAsViewed: id => dispatch( markAsViewed(id) ),
    removeFlashMessage: id => dispatch( removeFlashMessage(id) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessages);
