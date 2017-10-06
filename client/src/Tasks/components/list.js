import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import config from 'Config/app.js'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import Select from 'react-select'
import CreatedTasksTable from './tableCreated'
import AssignedTasksTable from './tableAssigned'
import FlashMessages from 'FlashMessages'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import LocaleUtils from 'react-day-picker/moment'
import moment from 'moment'
import 'moment/locale/es'
import { formatDateVisually, formatDateForStorage } from 'Commons/utils/dates'
import swal from 'sweetalert2'
import _ from 'lodash'

class TasksPage extends Component {

    static propTypes = {
        tasks: PropTypes.object.isRequired,
        users: PropTypes.array.isRequired,
        statuses: PropTypes.array.isRequired,
        current_user: PropTypes.object.isRequired,
        statuses: PropTypes.array.isRequired,
        fetchTasksList: PropTypes.func.isRequired,
        fetchUsersList: PropTypes.func.isRequired,
        onRemoveTask: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    static defaultProps = {
        tasks: {
            created: {},
            assigned: {}
        }
    }

    constructor(props) {
        super(props);
       
        // bind actions
        this.filterByDate = this.filterByDate.bind(this);
        this.filterByReceiver = this.filterByReceiver.bind(this);
        this.filterByStatus = this.filterByStatus.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);

        // define default filters
        this.state = {   
            query: queryString.parse(location.search),
            filters: {
                date_from: {},   
                date_to: {},   
                receiver: {},      
                status: {}     
            },
        };
    }

    componentDidMount() {

        const self = this;
        const query = this.state.query;

        /**
         * Get all dropdownlists data before fetching table data
         */
        this.props.fetchUsersList()
        .then(()=>{
            // apply predefined filter     
            if(query.receiver_id) {
                const user = _.find(self.props.users, {id: parseInt(query.receiver_id)});
                self.filterByReceiver(user, false);
            }             
        })
        .then(()=>{

            if(query.date_to) {
                self.filterByDate('date_to', query.date_to, false);
            }

            if(query.date_from) {
                self.filterByDate('date_from', query.date_from, false);
            } else {
                // 30 days backwards, strating from now
                self.filterByDate('date_from', moment().subtract(30, 'days'), false);
            }

            if(query.status) {
                const status = _.find(self.props.statuses, {id: query.status});
                return self.filterByStatus(status, false);
            }   

            // fetch table data
            self.filter();
        });        
    }

    /**
     * Sets filter in state.
     * Latelly, filter() method will reflect it in URL
     */
    setFilter(name, value, callback = null) {
        return this.setState({
            filters: Object.assign({}, this.state.filters, {
                [name]: value || {}
            })
        }, callback);
    }

    /**
     * Gathers all current filters and dispatchs an action
     */
    filter() { 
        
        const filters = {
            date_from: this.state.filters.date_from,
            date_to: this.state.filters.date_to,
            receiver_id: this.state.filters.receiver.id,
            status: this.state.filters.status.value
        };

        const formattedFilters = Object.assign({}, filters, {
             date_from: formatDateForStorage(this.state.filters.date_from),
             date_to: formatDateForStorage(this.state.filters.date_to)
        })

        // fetch data server side
        this.props.fetchTasksList(this.props.current_user.id, formattedFilters);

        // update query string
        this.props.history.push({
            search: queryString.stringify(formattedFilters)
        });

        // state
        this.setState({query: filters});
    }

    filterByReceiver(user, fetch = true) {
             
        const self = this;
       
        // set filter in state (& URI)
        this.setFilter('receiver', user, _ => {
            // fetch data from server
            if (fetch) self.filter(); 
        });
    }

    filterByDate = (field, date, fetch = true) => {

        const self = this;

        // set filter in state (& URI)
        this.setFilter(field, date, _ => {
            // fetch data from server
            if (fetch) self.filter(); 
        });
    };

    filterByStatus(status, fetch = true) {

        const self = this;

        // set current state 
        this.setFilter('status', status, _ => {
            // fetch data from server
            if (fetch) self.filter()
        });
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onDeleteClicked(id) {
      
        const self = this;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará la tarea",
        }).then(function () {
            self.props.onRemoveTask(id).catch(_=>{
                self.props.flashSuccess({
                    text: "Se ha eliminado la tarea"
                })
            }).catch(err=>{
                self.props.flashError({
                    text: "Hubo un error al eliminar la tarea"
                })
            }); ;
        }, _=>{})  
    }

    render() {
       
        //const date = this.state.filters.sector || {};
        const receiver = this.state.filters.receiver || {};
        const status = this.state.filters.status || {};

        const createdTasks = this.props.tasks.created;
        const assignedTasks = this.props.tasks.assigned;
        const renderBothTables = createdTasks.length > 0 && assignedTasks.length > 0;
     
        const dayPickerProps = config.dates.dayPickerProps;

        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Tareas</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="messages">
                                <FlashMessages />
                            </div>
                            <div className="table-toolbar">
             
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="row tasks-filters">

                                            <div className="col-xs-6 col-sm-2">
                                                
                                                <div className="form-group date-small">
                                                    
                                                    <label>Desde:</label> <DayPickerInput
                                                        name="date_from"                                            
                                                        placeholder="dd/mm/yyyy"
                                                        format="DD/MM/YYYY"
                                                        value={formatDateVisually(this.state.filters.date_from) || ''}
                                                        onDayChange={val=>this.filterByDate("date_from", val)}
                                                        dayPickerProps={dayPickerProps}
                                                        />
                                                </div>

                                                <div className="form-group date-small">
                                                    
                                                    <label>Hasta:</label> <DayPickerInput
                                                        name="date_to"                                            
                                                        placeholder="dd/mm/yyyy"
                                                        format="DD/MM/YYYY"
                                                        value={formatDateVisually(this.state.filters.date_to) || ''}
                                                        onDayChange={val=>this.filterByDate("date_to", val)}
                                                        dayPickerProps={dayPickerProps}
                                                        />
                                                </div>
                                            </div>

                                            <div className="col-md-3 form-group">
                                                <Select
                                                name="receiver"
                                                placeholder="Dirigido a..."
                                                value={receiver.value}
                                                options={this.props.users}
                                                onChange={this.filterByReceiver}
                                                />
                                            </div>

                                            <div className="col-md-3 form-group">
                                                <Select
                                                name="status"
                                                placeholder="Estado..."
                                                value={status.value}
                                                options={this.props.statuses}
                                                onChange={this.filterByStatus}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2 text-right">
                                        <div className="btn-group">
                                            <Link to="/tareas/alta" className='btn sbold green'>                                              
                                                <i className="fa fa-plus"></i> <span> Nueva</span>                                
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                { (assignedTasks.length > 0) && 
                                    <div className="row">
                                        <div className="col-md-12">
                                                <AssignedTasksTable data={this.props.tasks.assigned} 
                                                    onUpdateStatus={this.props.onUpdateStatus}
                                                    statuses={this.props.statuses}
                                                    onDeleteClicked={this.onDeleteClicked} />
                                        </div>
                                    </div>
                                }
                                <hr/>
                                { (createdTasks.length > 0) && 
                                    <div className="row">
                                        <div className="col-md-12">
                                                <CreatedTasksTable data={this.props.tasks.created} 
                                                    onDeleteClicked={this.onDeleteClicked} />
                                        </div>
                                    </div>
                                }

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TasksPage