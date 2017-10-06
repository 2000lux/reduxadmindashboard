import React, {Component} from 'react'
import {connect} from 'react-redux'
import ReactQuill, { Quill, Mixin, Toolbar } from 'react-quill';
import {ButtonContainerRight,ButtonGreen} from '../../Commons/components/buttons'
import {
  saveComment
} from '../../Comments/actions'

class CommentForm extends Component {

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.save = this.save.bind(this)
    this.state = {
      comment: ""
    }
  }

  onChange(comment) {
    this.comment = comment
  }

  save() {
    if (this.comment.length > 0) {
      this.props.saveComment(this.props.parent_id,this.comment)
      .then(() => (
        this.setState(state => {
          return {...state, comment: ""}
        })
      ))
    }
  }

  render() {
    const {comment} = this.state
    return (
      <form className="form" style={{marginLeft:'130px'}}>
        <div className="form-group" style={{paddingRight:'20px'}}>
          <ReactQuill className="form-control"
            name="comment"
            value={comment}
            onChange={this.onChange}></ReactQuill>
          <ButtonContainerRight>
            <ButtonGreen onClick={this.save}>Enviar</ButtonGreen>
          </ButtonContainerRight>
        </div>
      </form>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    saveComment: (parent_id,comment) => saveComment({parent_id,comment,dispatch})
  }
}

export default connect(null,mapDispatch)(CommentForm)
