import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import config from '../../config/app.js'
import FlashMessages from '../../FlashMessages'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Form from './form'
import Actions from './tableActions'
import swal from 'sweetalert2'
import _ from 'lodash'
import Validate from 'Commons/hoc/validate'

class UserPage extends Component {

    static propTypes = {
        users: PropTypes.array.isRequired,
        roles: PropTypes.array.isRequired,
        onAddUser: PropTypes.func.isRequired,
        onSaveUser: PropTypes.func.isRequired,
        onRemoveUser: PropTypes.func.isRequired,
    }

    constructor(props) {

        super(props);

        // table actions
        this.formatTableActions = this.formatTableActions.bind(this);
        this.onEditClicked = this.onEditClicked.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        this.onSaveUser = this.onSaveUser.bind(this);
        this.onCancel = this.onCancel.bind(this);

        // table columns
        this.state = {
            columns: [
            {
                title: "Nombres",
                field: "fullname",
                sort: true,
                width: "160"
            }, {
                title: "Usuario",
                field: "username",
                sort: true,
                width: "100"
            }, {
                title: "Email",
                field: "email",
                sort: true,
                isKey: true,
                width: "190"
            }, {
                title: "Acciones",
                formatter: this.formatTableActions, // already binded
                sort: false,
                dataAlign: "center",
                width: "90"
            }
            ],
            selected: {}
        }

        // fetch data
        this.props.fetchUserList();
    }

    /**
     * Table actions column
     *
     * @param {*} cell
     * @param {*} row
     */
    formatTableActions(cell, row) {

        const actions = <Actions onEdit={this.onEditClicked} onDelete={this.onDeleteClicked} />;
        return React.cloneElement(actions, {id: row.id});
    }

    /**
     * On edit action clicked
     * @param {int} id
     */
    onEditClicked(id) {
        const user = this.props.users.find((user)=>{ return user.id === id });
        this.setState({selected: user})
    }

    /**
     * On delete action clicked
     * @param  id
     */
    onDeleteClicked(id) {

        const self = this;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará el usuario"
        }).then(function () {
            self.props.onRemoveUser(id).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha eliminado el registro",
                    target: "list"
                })
                self.resetForm();
            }).catch(_=>{
                self.props.flashError({
                    text: "Hubo un error eliminando el registro",
                    target: "list"
                })
            });
        }, function(dismiss) {
            console.log("dismiss deleting");
        })
    }

    showErrorMessage = () => {
      this.props.flashError({
          text: "Hubo un error al guardar los datos",
          target: "form"
      })
    }

    /**
     * On form submitted
     *
     * @param {obj} data
     */
    onSaveUser(data) {

        const self = this;

        // remove empty values
        data = _.omitBy(data, x=>{ return _.isNil(x) || x == ''});

        if(!data.id) {
            return this.props.onAddUser(data).then(response=>{
                self.props.flashSuccess({
                    text: "Se ha guardado los datos",
                    target: "form"
                });
                self.resetForm();
            })
        } else {
            return this.props.onSaveUser(data).then((response, code)=>{
                self.props.flashSuccess({
                    text: "Se ha guardado los datos",
                    target: "form"
                });
                self.resetForm();
            });
        }
    }

    /**
     * Just resets the form
     */
    onCancel() {
        this.resetForm();
    }

    /**
     * Clear all field
     */
    resetForm() {
        const state = _.mapValues(this.state.selected, () => '');
        state.password = '';
        state.password_confirmation = '';
        this.setState({selected: state})
    }

    render() {

        const options = config.tables.defaults;

        return (
            <div className="row">

                <div className="col-md-6">

                    <div className="portlet light bordered">
                        <div className="portlet-title">

                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Usuarios</span>
                            </div>
                        </div>
                        <div className="portlet-body">

                            <div className="messages">
                                <FlashMessages target="list" />
                            </div>

                            {
                                (this.props.users) &&

                                <BootstrapTable data={this.props.users} striped={true} hover={true}
                                    options={options} search searchPlaceholder='Buscar...' pagination>
                                    {
                                        this.state.columns.map((col, index)=>{

                                            return <TableHeaderColumn
                                                key={index}
                                                dataField={col.field}
                                                isKey={col.isKey}
                                                width={col.width}
                                                dataAlign={col.dataAlign}
                                                dataSort={_.isNil(col.sort) ? true : col.sort}
                                                dataFormat={col.formatter}
                                                filterFormatted={!_.isNil(col.formatter)}
                                                >{col.title}</TableHeaderColumn>
                                        })
                                    }
                                </BootstrapTable>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                  <Validate onSubmit={this.onSaveUser} errorCallback={this.showErrorMessage}>
                    {(errors, onSubmit) => {
                      return (
                        <Form data={this.state.selected}
                            roles={this.props.roles}
                            errors={errors}
                            fetchUserRoles={this.props.fetchUserRoles}
                            onSaveUser={onSubmit}
                            onCancel={this.onCancel} />
                      )
                    }}
                  </Validate>
                </div>
            </div>
        );
    }
}

export default UserPage
