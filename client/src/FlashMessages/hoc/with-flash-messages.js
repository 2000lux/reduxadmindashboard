import React, {Component} from 'react'
import {connect} from 'react-redux'
import addFlashMessage from '../actions'

const withFlashMessages = (WrappedComponent) => {
   
    const flashSuccess = (message) => {
        message.type = 'success';
        return addFlashMessage(message);
    }
    const flashInfo = (message) => {
        message.type = 'info';
        return addFlashMessage(message);
    }
    const flashWarning = (message) => {
        message.type = 'warning';
        return addFlashMessage(message);
    }
    const flashError = (message) => {
        message.type = 'danger';
        return addFlashMessage(message);
    }
    const cleanupFlashMessages = () => {
        return cleanupFlashMessages();
    }

    const mapDispatchToProps = (dispatch, props) => {
         
        return {
            ...props,
            flashSuccess: (message) => { dispatch(flashSuccess(message)) },
            flashError: (message) => { dispatch(flashError(message)) },
            flashWarning: (message) => { dispatch(flashWarning(message)) },
            flashDanger: (message) => { dispatch(flashDanger(message)) },
            cleanupFlashMessages: () => { dispatch(cleanupFlashMessages()) }
        }
    }
    return connect(null, mapDispatchToProps)(WrappedComponent)
}

export default withFlashMessages