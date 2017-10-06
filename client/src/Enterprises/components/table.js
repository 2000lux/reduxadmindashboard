import React, {Component} from 'react'
import PropTypes from 'prop-types'
import config from '../../config/app.js'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Actions from './tableActions'
import _ from 'lodash'

class EnterprisesTable extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired,     
        onDeleteClicked: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        // bind actions
        this.formatTableActions = this.formatTableActions.bind(this);
      
        // define table columns
        this.state = {
            columns: [
                {
                    title: "Razón Social",
                    field: "legal_name",
                    width: "180"
                }, {
                    title: "CUIT",
                    field: "cuit",
                    isKey: true,
                    width: "120"
                }, {
                    title: "Provincia",
                    field: "province.name",
                    formatter: this.formatChildfield,
                    sort: false,
                    width: "100"
                }, {
                    title: "Localidad",
                    field: "town",
                    width: "120"
                }, {
                    title: "Dirección",
                    field: "address",
                    width: "130"
                }, {
                    title: "Código Postal",
                    field: "zipcode",
                    width: "90"
                }, {
                    title: "Teléfonos",
                    field: "phone",
                    width: "190"
                }, {
                    title: "Acciones",
                    formatter: this.formatTableActions, // already binded 
                    sort: false,
                    width: "210"
                }
            ]
        };      
    }

    /**
     * Extract data from child fields
     */
    formatChildfield = (cell, row, extra) => {
        const value = _.get(row, extra.field);
        return <div>{value}</div>;
    };

    /**
     * Table actions column
     * 
     * @param {*} cell 
     * @param {*} row 
     */
    formatTableActions(cell, row) {      
        const actions = <Actions onDelete={this.onDeleteClicked.bind(this)} />;
        return React.cloneElement(actions, {id: row.id});
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onDeleteClicked(id) {
        this.props.onDeleteClicked(id);
    }

    render() {
            
        const options = config.tables.defaults;    

        return (
                      
            <BootstrapTable data={this.props.data} 
                options={options}
                striped={true} hover={true} 
                search searchPlaceholder='Buscar...' pagination>                                    
                {                                        
                    this.state.columns.map((col, index)=>{
                        
                        return <TableHeaderColumn 
                            key={index}
                            dataField={col.field} 
                            isKey={col.isKey}
                            width={col.width}
                            dataSort={_.isNil(col.sort) ? true : col.sort}
                            dataFormat={col.formatter}
                            formatExtraData={col}
                            filterFormatted={!_.isNil(col.formatter)}
                            >{col.title}</TableHeaderColumn>
                    })
                }
            </BootstrapTable>           
        );
    }
}

export default EnterprisesTable