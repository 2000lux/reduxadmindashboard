import React, { Component } from 'react'
import { connect } from 'react-redux'
import Profile from '../../Layout/components/Header/profileWidget'
import logout from '../actions'

const mapStateToProps = (store, ownProps) => {
    
    return {
        session: store.session
    }
}

const mapDispatchToProps = dispatch => {
    return { }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile)

