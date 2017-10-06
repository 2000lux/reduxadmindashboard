import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Row from './tasksWidget.row'

class TasksWidget extends Component {

    static propTypes = {
        tasks: PropTypes.array.isRequired,
        current_user: PropTypes.object.isRequired,
        fetchTasksList: PropTypes.func.isRequired,
    }

    static defaultProps = {
        tasks: []
    }

    constructor(props) {
        super(props);
        this.state = {
            tasks: props.tasks
        };
    }

    componentDidMount() {
        const tasks = this.props.fetchTasksList(this.props.current_user.id);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            tasks: newProps.tasks
        })
    }

    render() {

        const tasks = this.state.tasks.filter(x=>x.status=='pendiente');
        const count = tasks.filter(x=>!x.viewed).length;
       
        return (
            <li className="dropdown dropdown-extended dropdown-notification" id="header_notification_bar">
                <a href="/tareas" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i className="icon-bell"></i>
                    { count > 0 && 
                        <span className="badge badge-default"> {count} </span>
                    }
                </a>
                <ul className="dropdown-menu">    
                    <li className="external">
                        <h3>
                            { count == 0 && <span> notificaciones</span> } 
                            { count == 1 && <span><span className="bold">{count} </span> nueva notificaci&oacute;n</span> } 
                            { count > 1 && <span><span className="bold">{count} </span> nuevas notificaciones</span> } 
                        </h3>
                        <Link to="/tareas">ver todas</Link>
                    </li>              
                    <li>
                        <div className="slimScrollDiv"><ul className="dropdown-menu-list scroller" data-handle-color="#637283" data-initialized="1">
                            { tasks.length > 0 && 
                                tasks.map((task, i)=>{ 
                                    return <Row key={i} data={task} />                       
                                })
                            } 
                        </ul><div className="slimScrollBar"></div><div className="slimScrollRail"></div></div>
                    </li>
                </ul>
            </li>
        )
    }
}

export default TasksWidget