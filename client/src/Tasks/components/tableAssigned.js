import React, {Component} from 'react'
import PropTypes from 'prop-types'
import config from '../../config/app.js'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { formatChildfield, stripTags } from '../../Commons/utils/formatters'
import Actions from './tableAssigned.actions'
import swal from 'sweetalert2'
import _ from 'lodash'

class CreatedTasksTable extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired,     
        statuses: PropTypes.array.isRequired,     
        onUpdateStatus: PropTypes.func.isRequired,
        onDeleteClicked: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
      
        // bind actions
        this.formatTableActions = this.formatTableActions.bind(this);
        this.setRowClassName = this.setRowClassName.bind(this);
      
        // define table columns
        this.state = {
            columns: [
                {
                    title: "Id",
                    field: "id",
                    isKey: true,
                    width: "60"
                },
                {
                    title: "Fecha",
                    field: "created_at",
                    width: "85"
                }, {
                    title: "Asignada por",
                    field: "author.fullname",
                    formatter: formatChildfield,
                    width: "150"
                }, {
                    title: "Empresa",
                    field: "enterprise.legal_name",
                    formatter: formatChildfield,
                    width: "160"
                }, {
                    title: "Contacto",
                    field: "contact.fullname",
                    formatter: formatChildfield,
                    width: "140"
                }, {
                    title: "Descripción",
                    field: "description",
                    formatter: stripTags,
                    width: "200"
                }, {
                    title: "Estado",
                    field: "status",
                    width: "90"
                }, {
                    title: "Acciones",
                    className: 'white-bg',
                    formatter: this.formatTableActions, // already binded 
                    sort: false,
                    width: "110"
                }                
            ]
        };      
    }

    /**
     * Extract data from child fields
     */
    formatStatefield = (cell, row, extra) => {
        const value = _.get(row, extra.field);
        let style = "label label-sm label-";
        style+= (row.state.keyname !== 'activo') ? 'danger' : 'success';
        return <span className={style}> {value} </span>
    };


    /**
     * Table actions column
     * 
     * @param {*} cell 
     * @param {*} row 
     */
    formatTableActions(cell, row) {     
        const actions = <Actions 
                    onUpdateStatus={this.onUpdateStatus.bind(this)}
                    onDelete={this.onDeleteClicked.bind(this)} />;
        return React.cloneElement(actions, {
            task_id: row.id,
            data: row
        });
    }

    onUpdateStatus(task_id) {
        
        const self = this;

        // prepare list of enterprises
        let options = {};
        this.props.statuses.forEach(x=>{
            if(x.value === this.props.data.status) return; // skip current
            return options[x.id] = x.label;
        })

        swal({
            ... config.tables.swalConfirm,
            type: null,
            title: "Nuevo estado",
            text: null,
            input: 'select',
            inputOptions: options
        }).then(function (newStatus) {

            const payload = {
                id: task_id,
                status: newStatus
            }
          
            // replace
            self.props.onUpdateStatus(payload)
                .catch(err=>{                
                    swal({
                        type: 'error',
                        html: 'Hubo un error en el sistema y no se actualizó el estado'
                    })                
                });               
        }, _=>{})
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onDeleteClicked(id) {
        this.props.onDeleteClicked(id);
    }

    setRowClassName(fieldValue, row, rowIdx, colIdx) {
        // highlight urgent tasks
        return row.priority === 'urgente' ? 'red-row' : '';
    }

    render() {
            
        const options = config.tables.defaults;

        return (
                      
            <div>
                <h4>Dirigidas a mí</h4>
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
                                columnClassName={col.className || this.setRowClassName}
                                >{col.title}</TableHeaderColumn>
                        })
                    }
                </BootstrapTable>
            </div>         
        );
    }
}

export default CreatedTasksTable