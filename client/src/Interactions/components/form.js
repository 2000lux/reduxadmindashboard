import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import ReactQuill from 'react-quill'
import queryString from 'query-string'
import FlashMessages from '../../FlashMessages'
import View from './form.view'
import _ from 'lodash'

class Form extends Component {

    static defaultProps = {
        data: {
            contact: {}
        },
        contacts: []
    };

    static propsType = {
        data: PropTypes.array,
        contacts: PropTypes.isRequired,
        getInteraction: PropTypes.func.isRequired,
        getContacts: PropTypes.func.isRequired,
        onAddInteraction: PropTypes.func.isRequired,
        onSaveInteraction: PropTypes.func.isRequired,
        unselectInteraction: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    }

    constructor(props = {}) {
        super(props)

        this.state = Object.assign({}, Form.defaultProps, props, {
            isEdition: props.match.params.interaction_id ? true : false,
            enterprise_id: this.props.match.params.enterprise_id            
        });
    
        if(!this.state.isEdition) {
            // re assure we are creating from scratch
            this.props.unselectInteraction();
        }
      
        // events
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleQuillChange = this.handleQuillChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
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
            
            this.props.getInteraction(this.state.enterprise_id, this.props.match.params.interaction_id)
            .then(()=> {

                self.props.getContacts(self.state.enterprise_id).then(_=>{

                    // set predefined contact
                    const contact = self.state.data.contact;
                    self.handleContactChange(contact);
                })
            });
        } else {

            const lodash = _;
            this.props.getContacts(this.state.enterprise_id).then(_=>{

                const query = queryString.parse(location.search);
                if(query.contact_id) {
                    // set predefined from URI
                    const contact = lodash.find(self.props.contacts, {id: parseInt(query.contact_id)});
                    self.handleContactChange(contact);
                }
            });
        }
    }

    /**
     * Form data received for edition
     * 
     * @param  nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
        });
    }

    handleContactChange(contact) {

        // set predefined contact
        this.setState({
            data: Object.assign({}, this.state.data, {
                contact
            })
        });        
    }

    handleDateChange = date => {
        this.setState({ 
            data: Object.assign({}, this.state.data, {
                date
            })
        });
    };

    /**
     * Handle Quill wysiwyg
     * @param {*} event 
     */
    handleQuillChange(field, value) {
        this.setState({
            data: Object.assign({}, this.state.data, {
                [field]: value
            })
        });
    }

    save(data) {
     
        const self = this;

        if(!data.id) {
            this.props.onAddInteraction(data.contact.id, data).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha guardado los datos"
                })
                this.clear();
                this.backToList();
            }).catch(err=>{
                console.log(err);
                this.props.flashError({
                    text: "Hubo un error al guardar los datos"
                })
            });  
        } else {
            this.props.onSaveInteraction(data.contact.id, data).then(err=>{
                self.props.flashSuccess({
                    text: "Se ha guardado los datos"
                })
                this.clear();
                this.backToList();
            }).catch(err=>{
                console.log(err);
                this.props.flashError({
                    text: "Hubo un error al guardar los datos"
                })
            });    
        }
    }

    cancel() {
        this.clear();
        this.backToList();
    }

    clear() {
        this.setState({ data: Form.defaultProps.data}); // reset state
        this.props.unselectInteraction(); // redux action
    }

    backToList() {
        this.props.history.goBack(); // redirect
    }

    render() {
       
        return (
            <View data={this.state.data} 
                contacts={this.props.contacts}
                isEdition={this.state.isEdition}
                handleContactChange={this.handleContactChange}
                handleQuillChange={this.handleQuillChange}
                handleDateChange={this.handleDateChange}
                save={this.save}
                cancel={this.cancel}
            /> 
        );
    }
}

export default Form
