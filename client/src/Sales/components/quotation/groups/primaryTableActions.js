import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

class Actions extends Component {

    static propTypes = {
        id: PropTypes.number,
        download_link: PropTypes.string,
        onEdit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        onDisplayDetail: PropTypes.func.isRequired,
        onDownloadExcel: PropTypes.func.isRequired
    }

    /**
     * ID will be provided on the fly by Table component iterator
     */
    static defaultProps = {
        id: null      
    };

    render() {

        const arrowIcon = this.props.secondaryTableDisplayed ? "fa fa-arrow-up" : "fa fa-arrow-down";

        return (
            <div className="actions">     
                { this.props.download_link && 
                    <button type="button" className="btn btn-circle btn-icon-only btn-default grey-gallery" 
                            onClick={()=>{this.props.onDownloadExcel(this.props.id)}}
                            title="Bajar planilla Excel" >
                        <i className="fa fa-file-excel-o"></i>
                    </button> 
                }      
                <button type="button" className="btn btn-circle btn-icon-only btn-default green" 
                        onClick={()=>{this.props.onEdit(this.props.id)}}
                        title="Editar" >
                    <i className="fa fa-pencil"></i>
                </button>            
                <button type="button" className="btn btn-circle btn-icon-only btn-default red" 
                        onClick={()=>{this.props.onDelete(this.props.id)}}
                        title="Eliminar" >
                    <i className="fa fa-remove"></i>
                </button>            
                <button type="button" className="btn btn-circle btn-icon-only btn-default blue" 
                        onClick={()=>{this.props.onDisplayDetail(this.props.id)}}
                        title="Desplegar detalle" >
                    <i className={arrowIcon}></i>
                </button>            
            </div>
        )
    }
}

export default Actions