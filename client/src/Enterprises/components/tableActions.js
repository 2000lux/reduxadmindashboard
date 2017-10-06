import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

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
                <Link className="btn btn-circle btn-icon-only yellow-crusta btn-default"
                    title="Sectores"
                    to={"/empresas/"+ this.props.id +"/sectores"}>
                        <i className="fa fa-users"></i>
                </Link>
                <Link className="btn btn-circle btn-icon-only blue btn-default"
                    title="Contactos"
                    to={"/empresas/contactos?enterprise_id="+this.props.id+"&state_id=1"}>
                    <i className="fa fa-user"></i>
                </Link>
                <Link className="btn btn-circle btn-icon-only grey-gallery btn-default"
                    title="Interacciones"
                    to={"/empresas/"+ this.props.id +"/interacciones"}>
                    <i className="fa fa-commenting"></i>
                </Link>
                <Link className="btn btn-circle btn-icon-only btn-default green"
                    to={"/empresas/"+ this.props.id +"/edicion"}>
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