import React, {Component} from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter
  } from 'react-modal-bootstrap';

class ModelsListModal extends Component {

    
    constructor(props) {
        super(props);
    
        this.state = {
            filter: ''
        }
    
        this.handleFilter = this.handleFilter.bind(this);
    
    } 

    handleFilter(e) {
        this.setState({
            filter: e.target.value
        })
    }
    
    render() {

        const list = this.props.data
            .filter(x=>x.name.toLowerCase().indexOf(this.state.filter.toLowerCase())!=-1)
            .map((x,i)=>
            <li key={i} className="list-group-item"> 
                <span>{x.name}</span>
                <a href={x.link} 
                    title={x.name}
                    className="btn btn-circle btn-icon-only btn-default yellow-crusta pull-right">
                    <i className="fa fa-file-word-o"></i> 
                </a>
            </li>          
        );

        return (
            <Modal isOpen={this.props.isOpen} onRequestHide={this.props.hideModal}>
            <ModalHeader>
                <ModalClose onClick={this.props.hideModal}/>
                <ModalTitle>Modelos de Cotización</ModalTitle>
            </ModalHeader>
            <ModalBody>      
                <div className="quotation-models-modal">        
                    <div className="row">
                        
                        <div className="panel-body">
                            <div className="col-md-12">
                                <div className="input-group">
                                    <input name="filter" className="form-control"
                                        value={this.state.filter} 
                                        placeholder="Filtrar por nombre"
                                        onChange={this.handleFilter} />
                                </div>
                            </div>

                            <hr/>

                            <div className="col-md-12">                                
                                <div className="clearfix">
                                    <div className="panel panel-warning">
                                        <div className="panel-heading">
                                            <h3 className="panel-title">Descarga</h3>
                                        </div>                                        
                                        <ul className="list-group">
                                            { list }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                
            </ModalBody>
            <ModalFooter>
                <button className='btn btn-default' onClick={this.props.hideModal} type="button">
                    Cerrar
                </button>
            </ModalFooter>
        </Modal>            
        );
    }
}

export default ModelsListModal