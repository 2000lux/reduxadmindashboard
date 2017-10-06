import React, {Component} from 'react'
import { connect } from 'react-redux'
import { logout } from '../actions'
import { Redirect } from 'react-router-dom'

class Logout extends Component {
  
  constructor(props) {
    super(props)
    props.logout();
    window.location.href = '/login';
  }

  render(){ return null }
}

const mapStateToProps = (store, ownProps) => {  
    return {}
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => { dispatch(logout()) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)
