import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import config from '../../config/app.js'
import Actions from './tableActions'
import swal from 'sweetalert2'
import List from './list'
import Form from './form'

class SectorsPage extends Component {

    static propTypes = {
        enterprise: PropTypes.object.isRequired,
        fetchSectorList: PropTypes.func.isRequired,
        getEnterprise: PropTypes.func.isRequired,
        onAddSector: PropTypes.func.isRequired,
        onSaveSector: PropTypes.func.isRequired,
        onRemoveSector: PropTypes.func.isRequired
    }

    constructor(props) {

        super(props);

        this.state = {
            selected: undefined,
            enterprise_id: props.match.params.id
        }

        // table actions
        this.onEditClicked = this.onEditClicked.bind(this);
        this.onSaveSector = this.onSaveSector.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentDidMount() {

        // fetch data
        this.props.fetchSectorList(this.state.enterprise_id);  

        this.props.getEnterprise(this.state.enterprise_id);
    }

    /**
     * On edit action clicked
     * @param  id 
     */
    onEditClicked(id) {
        const sector = this.props.sectors.find((sector)=>{ return sector.id === id });
        this.setState({selected: sector})
    }

    /**
     * On delete action clicked
     * @param  id 
     */
    onDeleteClicked(sector_id) {
        this.props.onRemoveSector(this.state.enterprise_id, sector_id).then(res=>{
            this.props.flashSuccess({
                text: "Se ha eliminado el registro",
                target: "list"
            })
            this.resetForm();
        }).catch(_=>{
            this.props.flashError({
                text: "Hubo un error eliminando el registro",
                target: "list"
            })
        }); 
    }

    /**
     * On form submitted
     * 
     * @param  data 
     */
    onSaveSector(data) {
      
        if(!data.id) {
            this.props.onAddSector(this.state.enterprise_id, data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado los datos",
                    target: "form"
                })
                this.resetForm();
            }).catch(_=>{
                this.props.flashError({
                    text: "Hubo un error al guardar los datos",
                    target: "form"
                })
            }); 
        } else {
            this.props.onSaveSector(this.state.enterprise_id, data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado los datos",
                    target: "form"
                })
                this.resetForm();
            }).catch(_=>{
                this.props.flashError({
                    text: "Hubo un error al guardar los datos",
                    target: "form"
                })
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
        this.setState({selected: undefined})
    }

    render() {
     
        return (
            <div className="row">

                <div className="col-md-6">
                    <List 
                        sectors={this.props.sectors}
                        enterprise={this.props.enterprise}
                        enterprise_id={this.props.match.params.id}
                        onEditClicked={this.onEditClicked}
                        onDeleteClicked={this.onDeleteClicked}
                        />
                </div>

                <div className="col-md-6">
                    <Form data={this.state.selected} 
                        enterprise_id={this.props.match.params.id}
                        onSaveSector={this.onSaveSector} 
                        onCancel={this.onCancel} />                    
                </div>
            </div>
        );
    }
}

export default SectorsPage
