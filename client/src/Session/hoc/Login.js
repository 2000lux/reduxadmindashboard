import React from 'react'
import { connect } from 'react-redux'
import Login from '../components/login'
import { login } from '../actions'

const mapStateToProps = (store, ownProps) => {  
    return { 
      profile: store.profile
    }
}

const mapDispatchToProps = dispatch => {
  return {
    doLogin: (data) => { return dispatch(login(data)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
