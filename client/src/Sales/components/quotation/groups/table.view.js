import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import config from 'Config/app.js'
import { formatChildfield } from 'Commons/utils/formatters'
import swal from 'sweetalert2'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import PrimaryTableActions from './primaryTableActions'
import SecondaryTableActions from './secondaryTableActions'

class TableWidget extends Component {

    render() {

        const mainTableheaderClass = this.props.index === 0 ? '' : 'hidden'
        const quotation_groups = this.props.quotation_group.map(x=>{
            return Object.assign({}, x, {fob_price: x.fob});
        });
        
        return (

            <div>
                <BootstrapTable data={quotation_groups}
                    tableHeaderClass={mainTableheaderClass}
                    options={{noDataText: 'No hay productos cotizados'}} striped={true} hover={true} >                                    
                    {                                        
                        this.props.primaryTableColumns.map((col, index)=>{
                        
                            return <TableHeaderColumn 
                                key={index}
                                dataField={col.field} 
                                isKey={col.isKey}
                                width={col.width}
                                dataFormat={col.formatter}
                                formatExtraData={col}
                                filterFormatted={!_.isNil(col.formatter)}
                                >{col.title}</TableHeaderColumn>
                        })
                    }
                </BootstrapTable>  

                { this.props.displaySecondaryTable && 
                    <BootstrapTable data={this.props.products} 
                        tableHeaderClass='secondary-table-header'
                        tableBodyClass='secondary-table-body'
                        options={{noDataText: 'No hay productos cotizados'}} hover={true} >                                    
                        {                                        
                            this.props.secondaryTableColumns.map((col, index)=>{
                                
                                return <TableHeaderColumn 
                                    key={index}
                                    dataField={col.field} 
                                    isKey={col.isKey}
                                    width={col.width}
                                    dataFormat={col.formatter}
                                    formatExtraData={col}
                                    filterFormatted={!_.isNil(col.formatter)}
                                    >{col.title}</TableHeaderColumn>
                            })
                        }
                    </BootstrapTable>  
                }
            </div>
        );
    }
}

export default TableWidget