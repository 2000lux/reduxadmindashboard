import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

class Actions extends Component {

    static propTypes = {
        id: PropTypes.number,
        onEdit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
    }

    /**
     * ID will be provided on the fly by Table component iterator
     */
    static defaultProps = {
        id: null
    };

    render() {
        return (
            <div className="actions">
                <button type="button" className="btn btn-circle btn-icon-only btn-default green" onClick={()=>{this.props.onEdit(this.props.id)}}>
                    <i className="fa fa-pencil"></i>
                </button>
                <button type="button" className="btn btn-circle btn-icon-only btn-default red" onClick={()=>{this.props.onDelete(this.props.id)}}>
                    <i className="fa fa-remove"></i>
                </button>            
            </div>
        )
    }
}

export default Actions