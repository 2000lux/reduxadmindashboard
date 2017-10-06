import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames  from 'classnames'
import Item from './Item'
import { Link } from 'react-router-dom'

class ItemGroup extends Component {

    /**
     * Default null route for first level accordion item
     */
    static defaultProps = {
      route: '#' 
    };

    constructor(props) {
        super(props);        
    }

    isActive() {

        const {route, currentPath, children} = this.props   

        return (route == currentPath) 
                        || (children && children.find(itm => itm.route == currentPath) != null);
    }   

    /**
     * This hacky mechanism is intended to live aside Accordion withouth event conflicts.
     * Basically, we need to give the item (being a first level item in the accordion) a chance to navigate.
     */
    forceState (e) {

        // if element has children this mean that we will extend Accordion functionallity. Otherwise it's not needed.
        if(typeof this.props.children !== 'undefined')
        {
            this.props.onGroupLinkClicked(this.props.route);
        }
       
        return true;
    }

    render() {

        const {title, route, currentPath, children} = this.props        
        const icon = this.props.icon || "icon-diamond"

        const active = this.isActive();

        const linkStyle = active ? ["start", "active", "open"] : []
        const arrowStyle = active ? ["open"] : []

        return (

            <li className={classNames("nav-item", ...linkStyle)}>
                
                <Link to={route} className="nav-link nav-toggle" onClick={(e)=>{ return this.forceState(e); }}>
                    <i className={classNames(icon)}></i>
                    <span className="title">{title}</span>
                    <span className={classNames("arrow", ...arrowStyle)}></span>
                    {active && <span className="selected"></span> }
                </Link>

                {
                    children &&
                    <ul className="sub-menu">
                        {children.length && children.map((itm,i) => {
                            return <Item currentPath={currentPath} key={i} {...itm} />
                        })}                    
                    </ul>
                }
            </li>
        )
    }
}

/**
 * Type validation
 */
ItemGroup.propTypes = {
    title : PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.shape({
        active: PropTypes.bool,
        title: PropTypes.string,
        route: PropTypes.string
    }))
}

export default ItemGroup