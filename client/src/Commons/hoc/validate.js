import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Validate extends Component {

  static PropsType = {
    onSubmit: PropTypes.func.isRequired,
    errorCallback: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      errors: {
        messageContainer: this.messageContainer,
        hasError: this.hasError
      }
    }
  }

  messageContainer = message => {
    return (<div className="help-block">{message}</div>)
  }

  hasError = key => {
    return this.state.errors[key] ? 'has-error' : ''
  }

  setErrorState = err => {
    const errors = err.response.data
    errors.messageContainer = this.messageContainer
    errors.hasError = this.hasError
    this.setState(state => ({...state, errors}))
  }

  // Adds error handler on submit handler
  onSubmit = (data) => {
    this.props.onSubmit(data)
      .catch(err => {
        this.setErrorState(err)
        this.props.errorCallback(err)
      })
  }

  render() {
    const {errors} = this.state
    return (
      <div>
        {this.props.children(errors, this.onSubmit)}
      </div>
    )
  }
}

export default Validate
