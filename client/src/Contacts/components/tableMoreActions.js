import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

class Actions extends Component {

    static propTypes = {
        enterprise_id: PropTypes.number,
        contact_id: PropTypes.number,
        onReplace: PropTypes.func.isRequired,
        onTransfer: PropTypes.func.isRequired,
        onWithdraw: PropTypes.func.isRequired
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
                <button className="btn btn-circle btn-icon-only btn-default"
                    onClick={_=>{this.props.onReplace(this.props.enterprise_id, this.props.contact_id)}}
                    title="Reemplazar">
                        <i className="fa fa-refresh"></i>
                </button>
                <button className="btn btn-circle btn-icon-only btn-default"
                    onClick={_=>{this.props.onTransfer(this.props.enterprise_id, this.props.contact_id)}}
                    title="Trasladar">
                    <i className="fa fa-share"></i>
                </button>
                <button className="btn btn-circle btn-icon-only btn-default"
                    onClick={_=>{this.props.onWithdraw(this.props.enterprise_id, this.props.contact_id)}}
                    title="Baja" >
                    <i className="fa fa-exclamation-triangle"></i>
                </button>                      
            </div>
        )
    }
}

export default Actions