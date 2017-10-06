import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames  from 'classnames'
import config from '../../../config/app.js'
import moment from 'moment'
import 'moment/locale/es'

const Row = props => {

    const data = props.data;

    /**
     * Icon
     */
    const icons = {
        urgent: {
            label: "label-danger",
            icon: "fa fa-bolt",
            color: "red"
        },
        normal: { 
            label: "label-info",
            icon: "fa fa-bell-o",
            color: "green"
        }
    }
    const badge = data.priority == 'urgente' ? icons.urgent : icons.normal; 

    /**
     * Text
     */
    let copy = '';
    if(data.contact && data.contact.id) {
        copy = data.contact.fullname + " de " + data.enterprise.legal_name;
    } else if(data.sector && data.sector.id) {
        copy = data.sector.name + " de " + data.enterprise.legal_name;
    } else if(data.enterprise && data.enterprise.id) {
        copy = data.enterprise.legal_name;
    } else {
        copy = "Tarea de " + data.author.fullname;
    }

    /**
     * Time
     */
    const timelapse = moment(data.created_at, config.dates.visual_format).fromNow();

    const viewed = data.viewed;
  
    return (
        <li className="notification">
            <Link to={"/tareas/"+data.id+"/detalle"}>
                <ul>
                    <li className={classNames("label", "label-sm", "label-icon", badge.label)}>
                        <i className={classNames("fa", badge.icon)}></i>
                    </li>
                    <li className="details">
                        { props.data.enterprise.legal_name } 
                    </li>
                    <li className="timelapse">
                        { timelapse }                    
                    </li>
                    <li className="viewed">
                    { !viewed && 
                        <span className={classNames("action-dot", "bg-"+badge.color)}></span>
                    }     
                    </li>           
                </ul>
            </Link>
        </li>
    )
}

export default Row