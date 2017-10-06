import React, {Component} from 'react'
import PropTypes from 'prop-types'
import config from '../../config/app.js'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { formatChildfield } from 'Commons/utils/formatters'
import Actions from './tableActions'
import _ from 'lodash'

class Table extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired,     
        onDeleteClicked: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        // bind actions
        this.formatTableActions = this.formatTableActions.bind(this);
      
        // define table columns
        this.state = {
            columns: [
                {
                    title: "ID",
                    field: "id",
                    isKey: true,
                    width: "60"
                },
                {
                    title: "Fecha",
                    field: "date",
                    width: "90"
                },
                {
                    title: "Empresa",
                    field: "enterprise.legal_name",
                    formatter: formatChildfield,
                    width: "180"
                }, {
                    title: "Estado",
                    field: "status.name",
                    formatter: formatChildfield,
                    width: "160"
                }, {
                    title: "Acciones",
                    formatter: this.formatTableActions, // already binded 
                    sort: false,
                    width: "90"
                }
            ]
        };      
    }

    /**
     * Table actions column
     * 
     * @param {*} cell 
     * @param {*} row 
     */
    formatTableActions(cell, row) {      
        const actions = <Actions 
                onDelete={this.onDeleteClicked.bind(this)}
                />;
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
                search searchPlaceholder= 'Buscar...'          
                pagination>                                    
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

export default Table