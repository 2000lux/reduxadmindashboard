import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames  from 'classnames'
import { Link } from 'react-router-dom'

class Item extends Component {

    render() {

        const {currentPath, route, title} = this.props
        const active = currentPath == route
        const activeStyles = active ? ["active"] : []

        return (

            <li className={classNames("nav-item", ...activeStyles)}>
                <Link to={route} className="nav-link">
                    <span className="title">{title}</span>
                </Link>
            </li>
        )
    }
}

/**
 * Type validation
 */
Item.propTypes = {
    title: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
}

export default Item