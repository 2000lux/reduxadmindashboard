import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import Select from 'react-select'
import { 
    handleInputChange, handleOptionChange, 
    handleDateChange, handleQuillChange } from 'Commons/utils/forms'
import ReactQuill from 'react-quill'
import Validate from 'Commons/hoc/validate'
import View from './form.view'
import _ from 'lodash'

class Form extends Component {

    static defaultProps = {
        data: {           
        }
    };
    static propTypes = {
        data: PropTypes.object,
        users: PropTypes.array.isRequired,
        enterprises: PropTypes.array.isRequired,
        contacts: PropTypes.array.isRequired,
        sectors: PropTypes.array.isRequired,
        statuses: PropTypes.array.isRequired,
        onAddTask: PropTypes.func.isRequired,
        onSaveTask: PropTypes.func.isRequired,
        unselectTask: PropTypes.func.isRequired,
        getUsersList: PropTypes.func.isRequired,
        getContacts: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired
    }

    constructor(props) {

        super(props);

        this.state = Object.assign({}, Form.defaultProps, props, {
            pristine: true,
            isEdition: props.match.params.id ? true : false     
        });
      
        if(!this.state.isEdition) {
            // re assure we are creating from scratch
            this.props.unselectTask();
        }

        // events
        this.handleOptionChange = handleOptionChange.bind(this);
        this.handleEnterpriseChange = this.handleEnterpriseChange.bind(this);
        this.handleSectorChange = this.handleSectorChange.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleClienTypeChange = this.handleClienTypeChange.bind(this);
        this.handleQuillChange = handleQuillChange.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    /**
     * Get data
     */
    componentDidMount() {

        const self = this;
         
        // fetch data under edition
        if(this.state.isEdition) {
           
            this.props.getTask(this.props.match.params.id).then(_=>{
                this.fetchData(); // fetch dropdowns data
            });
        }  else {            
            this.fetchData();
        }  
    }

    fetchData() {
         
        const self = this;

        // fetch receiver list
        this.props.getUsersList().then(_=> {
            // set predefined receiver
            const receiver = (self.state.isEdition) ? self.state.data.receiver : {};
            self.handleOptionChange("receiver", receiver);
        })
        .then(()=>{
            
            const lodash = _;
            
            // set default priority & status
            self.setState({
                data: Object.assign({}, self.state.data, {
                    priority: (self.state.isEdition) ? self.state.data.priority : 'normal',
                    status: (self.state.isEdition) ? self.state.data.status : self.props.statuses[0],
                })
            });
        })
        .then(_=>{
            // this will load sectors and contacs in cascade
            return this.fetchEnterprises();
        });
    }

    fetchEnterprises(filters = {}) {

        const self = this;

        // fetch enterprise/sectors list
        return this.props.getEnterprises(filters).then(_=> {
            // set predefined enterprise
            const enterprise = (self.state.data.enterprise) ? self.state.data.enterprise : {};
            return self.handleEnterpriseChange(enterprise);
        });        
    }

    fetchSectors(enterprise) {

        const self = this;
 
        return this.props.getSectors(enterprise.id).then(_=> {
            const sector = self.state.data.sector ? self.state.data.sector : {};
            return self.handleSectorChange(sector);
        });
    }

    fetchContacts(filters = {}) {

        const self = this;

        return this.props.getContacts(filters).then(_=>{
        
            const contact = (self.state.data.contact) ? self.state.data.contact : {};
            self.handleContactChange(contact);
        });
    }

    /**
     * Form data received for edition
     * 
     * @param {obj} newProps 
     */
    componentWillReceiveProps(newProps) {

        /**
         * Form is pristine until all data is loaded. This prevents props to override edited data
         */
        if(this.state.pristine) {

            if (this.state.isEdition && this.state.data.contact) {

                this.setState({
                    data: Object.assign({}, newProps.data, {
                        status: this.state.data.status,
                        client_type: this.state.data.enterprise.client_type
                    })
                });
            } else {
                this.setState({
                    data: Object.assign({}, newProps.data, {
                        status: newProps.statuses[0]
                    })
                });
            }
        }
    }

    handleClienTypeChange(client_type) {

        const self = this;

        // set predefined contact
        this.setState({
            data: Object.assign({}, this.state.data, {
                client_type,
                enterprise: {},
                sector: {},
                contact: {}
            })
        }, _=> {
            self.fetchEnterprises({client_type});
        });        
    }

    handleEnterpriseChange(enterprise) {
       
        const self = this;
     
        this.setState({
            data: Object.assign({}, this.state.data, {
                enterprise: enterprise || {},
                sector: (self.state.pristine) ? self.state.data.sector : {},
                contact: (self.state.pristine) ? self.state.data.contact : {},
            })
        },_=> {
            this.fetchSectors(enterprise);
        });
    }

    handleSectorChange(sector) {
       
        const self = this;
        sector = sector || {};

        this.setState({
            data: Object.assign({}, this.state.data, {
                sector: sector || {},
                contact: (self.state.pristine) ? self.state.data.contact : {},
            })
        },_=> {
            self.fetchContacts({
                client_type: self.state.data.client_type || null,
                enterprise_id: (self.state.data.enterprise) ? self.state.data.enterprise.id : {},
                sector_id: sector.id
            });
        });      
    }

    handleContactChange(contact) {

        // set predefined contact
        this.setState({
            data: Object.assign({}, this.state.data, {
                contact: contact || {}
            }),
            pristine: false
        });    
    }

    save(data) {

        const receiver_id = data.receiver.id;
        const contact_id = data.id;

        // will redirect to filtered list after saving
        const redirection = {
            pathname: '/tareas',
            search: queryString.stringify({
                receiver_id,
                status: data.status.value
            })
        }     

        if(!data.id) {
            // new
            return this.props.onAddTask(data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado los datos"
                })
                this.clear();
                this.props.history.push(redirection);
            }); 
        } else {
            // update
            return this.props.onSaveTask(data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado el registro"
                })
                this.clear();
                this.props.history.push(redirection);
            });  
        }        
    }

    showErrorMessage = () => {
        this.props.flashError({
            text: "Hubo un error al guardar los datos"
        })
    }

    cancel() {
        this.clear();
        this.backToList();
    }

    clear() {
        this.setState({ data: Form.defaultProps.data}); // reset state
        this.props.unselectTask(); // redux action
    }

    backToList() {
        this.props.history.goBack(); // redirect
    }

    render() {
       
        return ( 
            <Validate onSubmit={this.save} errorCallback={this.showErrorMessage}>
            {(errors, onSubmit) => {
                return ( 
                    <View data={this.state.data} 
                        isEdition={this.state.isEdition}
                        users={this.props.users}
                        enterprises={this.props.enterprises}
                        sectors={this.props.sectors}
                        contacts={this.props.contacts}
                        current_user={this.props.current_user}
                        statuses={this.props.statuses}
                        handleOptionChange={this.handleOptionChange}
                        handleClienTypeChange={this.handleClienTypeChange}
                        handleEnterpriseChange={this.handleEnterpriseChange}
                        handleSectorChange={this.handleSectorChange}
                        handleContactChange={this.handleContactChange}
                        handleQuillChange={this.handleQuillChange}
                        errors={errors}
                        save={onSubmit}
                        cancel={this.cancel}
                    /> 
                )
            }}
            </Validate>
        )
    }
}

export default Form