import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import config from '../../config/app.js'
import FlashMessages from '../../FlashMessages'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Form from './form'
import Actions from './tableActions'
import swal from 'sweetalert2'

class List extends Component {

    static propTypes = {
        sectors: PropTypes.array.isRequired
    }

    constructor(props) {

        super(props);

        // table actions
        this.formatTableActions = this.formatTableActions.bind(this);
        this.onEditClicked = this.onEditClicked.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
      
        // table columns
        this.state = {
            columns: [
            {
                title: "Nombre",
                field: "name",
                isKey: true,
                width: "180"
            }, {
                title: "Acciones",
                formatter: this.formatTableActions, // already binded 
                sort: false,
                dataAlign: "center",
                width: '90'
            }
            ],
            selected: {}
        }   
    }

    /**
     * Table actions column
     * 
     * @param {*} cell 
     * @param {*} row 
     */
    formatTableActions(cell, row) {     
 
        const actions = <Actions onEdit={this.onEditClicked.bind(this)} onDelete={this.onDeleteClicked.bind(this)} />;
        return React.cloneElement(actions, {
            enterprise_id: row.enterprise_id,
            sector_id: row.id
        });
    }

    /**
     * On edit action clicked
     * @param  id 
     */
    onEditClicked(id) {
       this.props.onEditClicked(id);
    }

    /**
     * On delete action clicked
     * @param  id 
     */
    onDeleteClicked(id) {

        const self = this;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará el sector"
        }).then(function () {
            self.props.onDeleteClicked(id);
        }, function(dismiss) {           
        })        
    }
  
    render() {
    
        return (
            
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Sectores</span>
                                <h4>{ this.props.enterprise.legal_name }</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="portlet-body">

                    <div className="messages">
                        <FlashMessages target="list" />
                    </div>

                    {
                        (this.props.sectors) && 

                        <BootstrapTable data={this.props.sectors} striped={true} hover={true} search searchPlaceholder='Buscar...' pagination>                                    
                            {                                        
                                this.state.columns.map((col, index)=>{
                                    
                                    return <TableHeaderColumn 
                                        key={index}
                                        dataField={col.field} 
                                        isKey={col.isKey}
                                        width={col.width}
                                        dataAlign={col.dataAlign}
                                        dataSort={col.sort}
                                        dataFormat={col.formatter}
                                        filterFormatted={!_.isNil(col.formatter)}
                                        >{col.title}</TableHeaderColumn>
                                })
                            }
                        </BootstrapTable>
                    }
                </div>
            </div>
                
        );
    }
}

export default List
