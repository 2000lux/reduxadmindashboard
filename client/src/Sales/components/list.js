import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import config from 'Config/app.js'
import queryString from 'query-string'
import Select from 'react-select'
import FlashMessages from 'FlashMessages'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import LocaleUtils from 'react-day-picker/moment'
import moment from 'moment'
import 'moment/locale/es'
import { formatDateVisually, formatDateForStorage } from 'Commons/utils/dates'
import swal from 'sweetalert2'
import Table from './table'

export default class Sales extends Component {
    
    static propTypes = {
        sales: PropTypes.array.isRequired,
        fetchSalesList: PropTypes.func.isRequired,
        fetchEnterpriseList: PropTypes.func.isRequired,
        fetchStatuses: PropTypes.func.isRequired,
        onRemoveSale: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    static defaultProps = {
        sales: []
    }

    constructor(props) {
        super(props);

        // bind actions
        this.filterByDate = this.filterByDate.bind(this);
        this.filterByEnterprise = this.filterByEnterprise.bind(this);
        this.filterByStatus = this.filterByStatus.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this); 

        this.state = {
            query: queryString.parse(location.search),
            filters: {
                date_from: {},   
                date_to: {},
                enterprise: {},
                status: {}
            }
        }
    }

    componentDidMount() {

        const self = this;
        const query = this.state.query;

        /**
         * Get all dropdownlists data befor fetching table data
         */
        this.props.fetchEnterpriseList()
        .then(()=>{
            // apply predefined filter     
            if(query.enterprise_id) {
                const enterprise = _.find(self.props.enterprises, {id: parseInt(query.enterprise_id)});
                return self.filterByEnterprise(enterprise, false);
            }             
        })
        .then(()=>{
            return this.props.fetchStatuses().then(() => {
                let status; 

                // apply predefined filter if present in URI  
                if(query.status_id) {
                    status = _.find(self.props.statuses, {id: parseInt(query.status_id)});
                }
        
                self.filterByStatus(status, false);
            });
        })
        .then(_=>{

            if(query.date_to) {
                self.filterByDate('date_to', query.date_to, false);
            }

            if(query.date_from) {
                self.filterByDate('date_from', query.date_from, false);
            } else {
                // 30 days backwards, strating from now
                self.filterByDate('date_from', moment().subtract(30, 'days'), false);
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
            enterprise_id: this.state.filters.enterprise.id,
            status_id: this.state.filters.status.value
        };

        const formattedFilters = Object.assign({}, filters, {
             date_from: formatDateForStorage(this.state.filters.date_from),
             date_to: formatDateForStorage(this.state.filters.date_to)
        })

        // get table data
        this.props.fetchSalesList(formattedFilters);

        // reflect filters in URI
        this.props.history.push({
            search: queryString.stringify(formattedFilters)
        });

        this.setState({query: filters});
    }

    /**
     * Filter by date range
     */
    filterByDate = (field, date, fetch = true) => {

        const self = this;

        // set filter in state (& URI)
        this.setFilter(field, date, _ => {
            // fetch data from server
            if (fetch) self.filter(); 
        });
    };

    /**
     * Filter by selected enterprise
     * 
     * @param {*} enterprise 
     * @param {boolean} fetch 
     */
    filterByEnterprise(enterprise, fetch = true) {
             
        const self = this;

        // set enterprise filter in state (& URI)
        this.setFilter('enterprise', enterprise, _=>{
            // filter table
            if (fetch) self.filter(); 
        });
    }

    /**
     * Filter by sale status
     * 
     * @param {*} status 
     * @param {boolean} fetch 
     */
    filterByStatus(status, fetch = true) {
             
        const self = this;
     
        // set enterprise filter in state (& URI)
        this.setFilter('status', status, _=>{
            // filter table
            if (fetch) self.filter(); 
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
            text: "Se eliminará el registro de la venta",
        }).then(function () {
            self.props.onRemoveSale(id)
            .then(_=>{
                self.props.flashSuccess({
                    text: "Se ha eliminado el registro"
                })
            }).catch(err=>{
                self.props.flashError({
                    text: "Hubo un error al eliminar el registro"
                })
            }); ;
        }, _=>{})  
    }

    render() {

        const enterprise = this.state.filters.enterprise || {};
        const status = this.state.filters.status || {};

        const dayPickerProps = config.dates.dayPickerProps;

        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Ventas</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="messages">
                                <FlashMessages />
                            </div>
                            <div className="table-toolbar">
             
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="row">
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

                                            <div className="col-md-6 col-lg-5 form-group">
                                                <Select
                                                name="enterprise"
                                                placeholder="Empresa..."
                                                value={enterprise.value}
                                                options={this.props.enterprises}
                                                onChange={this.filterByEnterprise}
                                                />
                                            </div>
                                            <div className="col-md-4 col-lg-4 form-group">
                                                <Select
                                                name="status"
                                                placeholder="Status..."
                                                value={status.value}
                                                options={this.props.statuses}
                                                onChange={this.filterByStatus}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2 text-right">
                                        <div className="btn-group">
                                            <Link to="/ventas/alta" className='btn sbold green'>                                              
                                                <i className="fa fa-plus"></i> <span> Nueva</span>                                
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            { (this.props.sales.length > 0) && 
                                <div className="row">
                                    <div className="col-md-12">
                                        <Table data={this.props.sales} 
                                            onDeleteClicked={this.onDeleteClicked} />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}