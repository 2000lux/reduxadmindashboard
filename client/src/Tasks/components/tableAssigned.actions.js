import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

class Actions extends Component {

    static propTypes = {
        task_id: PropTypes.number,
        data: PropTypes.object.isRequired,
        onUpdateStatus: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired
    }

    /**
     * ID will be provided on the fly by Table component iterator
     */
    static defaultProps = {
        id: null,
        data: {
            enterprise: {},
            sector: {},
            contact: {}
        }
    };

    render() {

        const data = this.props.data;
        let refLink = false;
      
        if(data.contact && data.contact.id) {
            refLink = "/empresas/"+data.enterprise.id+"/contactos/"+data.contact.id+"/edicion"
        } 
        else if(data.sector && data.sector.id) {
            refLink = "/empresas/contactos?enterprise_id="+data.enterprise.id+"&sector_id="+data.sector.id+"&state_id=1"
        } 
        else if(data.enterprise && data.enterprise.id) {
            refLink = "/empresas/"+data.enterprise.id+"/edicion";
        }

        return (
            <div className="actions">
                { refLink &&
                <Link className="btn btn-circle btn-icon-only btn-default"
                    to={refLink}
                    title="Referencia" >
                    <i className="glyphicon glyphicon-search"></i>
                </Link>
                }
                <button className="btn btn-circle btn-icon-only btn-default"
                    onClick={_=>{this.props.onUpdateStatus(this.props.task_id)}}
                    title="Cambiar estado">
                        <i className="fa fa-hourglass-start"></i>
                </button>
                <Link className="btn btn-circle btn-icon-only btn-default green"
                    to={"/tareas/"+this.props.task_id+"/detalle"}
                    title="Detalle" >
                    <i className="fa fa-commenting-o"></i>
                </Link>
                <button type="button" className="btn btn-circle btn-icon-only btn-default red" 
                        onClick={()=>{this.props.onDelete(this.props.task_id)}}
                        title="Eliminar" >
                    <i className="fa fa-remove"></i>
                </button>            
            </div>
        )
    }
}

export default Actions