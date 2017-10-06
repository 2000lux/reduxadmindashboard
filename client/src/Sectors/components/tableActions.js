import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

class Actions extends Component {

    static propTypes = {
        enterprise_id: PropTypes.number,
        sector_id: PropTypes.number,
        onEdit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
    }

    /**
     * ID will be provided on the fly by Table component iterator
     */
    static defaultProps = {
        sector_id: null
    };

    render() {

        const contacts_qs = queryString.stringify({
            sector_id: this.props.sector_id,
            enterprise_id: this.props.enterprise_id
        });

        return (
            <div className="actions">
                <Link className="btn btn-circle btn-icon-only btn-default"
                    title="Contactos"
                    to={"/empresas/contactos?"+contacts_qs}>
                    <i className="fa fa-user"></i>
                </Link>
                <button type="button" className="btn btn-circle btn-icon-only btn-default green" 
                    onClick={()=>{this.props.onEdit(this.props.sector_id)}}>
                    <i className="fa fa-pencil"></i>
                </button>
                <button type="button" className="btn btn-circle btn-icon-only btn-default red" 
                    onClick={()=>{this.props.onDelete(this.props.sector_id)}}>
                    <i className="fa fa-remove"></i>
                </button>            
            </div>
        )
    }
}

export default Actions