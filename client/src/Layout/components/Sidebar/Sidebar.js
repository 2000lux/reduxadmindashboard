import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter, Redirect } from 'react-router-dom'
import ItemGroup from './ItemGroup'
import SearchBox from './SearchBox'
import sidebarConfig from '../../../config/sidebar'

class Sidebar extends Component {

    /**
     * Type validation
     */
    static propTypes = {
        menu: PropTypes.shape({
            items: PropTypes.array
        }),
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props);     
    }

    /**
     * Force accordion to work as link as well
     */
    forceFirstLevelLink(route) {

        this.props.history.push(route)
    }

    render() {

        const items = sidebarConfig.menu.items;

        const { location } = this.props

        return (

            <div className="page-sidebar-wrapper">
                 
                <div className="page-sidebar navbar-collapse collapse">
                    <ul className="page-sidebar-menu  page-header-fixed" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">

                        <li className="sidebar-toggler-wrapper">
                            <div className="sidebar-toggler">
                                <span></span>
                            </div>
                        </li>

                        {items && items.map((itm,i) => {
                        
                            return <ItemGroup
                                key={i}
                                title={itm.groupTitle}
                                route={itm.route}
                                icon={itm.icon}
                                currentPath={window.location.pathname}
                                children={itm.items}
                                onGroupLinkClicked={this.forceFirstLevelLink.bind(this)}
                            />
                        })}
                            
                    </ul>
                </div>
            </div>         
        )
    }
}

export default withRouter(Sidebar)
