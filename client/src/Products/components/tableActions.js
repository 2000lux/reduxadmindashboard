import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

class Actions extends Component {

    static propTypes = {
        id: PropTypes.number,
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
                <Link type="button" className="btn btn-circle btn-icon-only btn-default green"
                    to={"/productos/"+ this.props.id +"/edicion"}>
                    <i className="fa fa-pencil"></i>
                </Link>
                <button type="button" className="btn btn-circle btn-icon-only btn-default red" onClick={()=>{this.props.onDelete(this.props.id)}}>
                    <i className="fa fa-remove"></i>
                </button>            
            </div>
        )
    }
}

export default Actions