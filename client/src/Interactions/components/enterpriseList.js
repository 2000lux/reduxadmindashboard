import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import config from '../../config/app.js'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import moment from 'moment'
import FlashMessages from '../../FlashMessages'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Actions from './tableActions'
import swal from 'sweetalert2'
import RichTextToPlain from '../../Commons/components/richTextToPlain'
import {ButtonContainerRight} from '../../Commons/components/buttons'
import Pagination from 'react-js-pagination'

import {
  Row
} from '../../Commons/components/bootstrap'

class EnterpriseInteractions extends Component {

    static propTypes = {
        interactions: PropTypes.array.isRequired,
        enterprise: PropTypes.object.isRequired,
        contact: PropTypes.object,
        getEnterprise: PropTypes.func.isRequired,
        getContact: PropTypes.func.isRequired,
        fetchEnterpriseInteractionList: PropTypes.func.isRequired,
        onRemoveInteraction: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
          contactIdProvided: props.location.pathname.indexOf('contactos') !== -1,
          enterprise_id: parseInt(props.match.params.enterprise_id),
          contact: {},
          activePage: 1
        }

        this.itemsCountPerPage = 5;
    }

    componentDidMount() {
        // fetch data
        const enterprise_id = this.state.enterprise_id;
        const contact_id = this.props.match.params.contact_id;
        this.props.fetchEnterpriseInteractionList(enterprise_id, contact_id);

        this.props.getEnterprise(enterprise_id);

        if(this.state.contactIdProvided) {
            this.props.getContact(enterprise_id, contact_id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.contactIdProvided && nextProps.contact) {
            this.state.contact = nextProps.contact;
        }
    }

    orderByDate(row1, row2) {
        return moment(row1.date, config.dates.visual_format) - moment(row2.date, config.dates.visual_format)
    }

    onDeleteClicked = (contant_id, interaction_id) => {
      swal({
          ... config.tables.onDeleteSwal,
          text: "Se eliminará la interacción",
      }).then(() => {
          this.props.onRemoveInteraction(contant_id, interaction_id);
      }, dismiss => {
          console.log("dismiss deleting");
      })
    }

    handlePageChange = (pageNumber) => {
      this.setState(state => ({activePage: pageNumber}));
    }

    render() {
      const {enterprise} = this.props
      const {id: enterprise_id} = enterprise

      // predefined contact
      const query = this.props.contact.id ? `contact_id=${this.state.contact.id}` : '';

      const page_to = this.state.activePage * this.itemsCountPerPage
      const page_from = page_to - this.itemsCountPerPage

      return (
          <div className="row interactions-page">
              <div className="col-md-12">

                  <div className="portlet light bordered">
                      <div className="portlet-title">
                          <div className="row">
                              <div className="col-md-6">
                                  <div className="caption">
                                      <i className="icon-social-dribbble font-dark hide"></i>
                                      <span className="caption-subject font-dark bold uppercase">Interacciones con la empresa</span>

                                      { this.state.contactIdProvided &&
                                          <div>
                                              <h3>{this.props.enterprise.legal_name}</h3>
                                              <h4>{this.state.contact.fullname}</h4>
                                          </div>
                                      }
                                      { !this.state.contactIdProvided &&
                                          <h4>{this.props.enterprise.legal_name}</h4>
                                      }

                                  </div>
                              </div>
                              <div className="col-md-6 text-right">
                                  <div className="btn-group">
                                      <Link to={`/empresas/${enterprise_id}/interacciones/alta?${query}`} className="btn sbold green">
                                          <i className="fa fa-plus"></i> <span> Alta</span>
                                      </Link>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="portlet-body">
                          <div className="messages">
                              <FlashMessages />
                          </div>

                          {
                            this.props.interactions.slice(page_from, page_to).map((interaction,i) => {
                              return (
                                <Row key={i} className="interation-box">
                                    <div className="col-md-12">
                                        <div className="portlet light">
                                          <div className="portlet-title">
                                              <div className="caption font-green-sharp">
                                                  <i className="icon-speech font-green-sharp"></i>
                                                  <span className="caption-subject bold uppercase">{interaction.contact.fullname}</span>
                                                  <span className="caption-helper caption-helper-date">{interaction.date}</span>
                                              </div>
                                              <ButtonContainerRight>
                                                    <div className="interactionList-buttons">
                                                    <Actions
                                                        enterpriseId={enterprise_id}
                                                        contactId={interaction.contact.id}
                                                        interactionId={interaction.id}
                                                        onDelete={this.onDeleteClicked} />
                                                    </div>
                                                </ButtonContainerRight>
                                            </div>
                                            <div className="portlet-body">
                                                <p><RichTextToPlain content={interaction.description} /></p>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                              )
                            })
                          }
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                            <div className="pull-right">
                            <Pagination
                                prevPageText="<"
                                nextPageText=">"
                                disabledClass="itemDisabled"
                                activePage={this.state.activePage}
                                itemsCountPerPage={this.itemsCountPerPage}
                                totalItemsCount={this.props.interactions.length}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange}
                            />
                            </div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
        );
    }
}

export default withRouter(EnterpriseInteractions)
