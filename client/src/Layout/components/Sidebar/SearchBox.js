import React, {Component} from 'react'

class SearchBox extends Component {

    render() {

        return (
            <li className="sidebar-search-wrapper">
                <form className="sidebar-search  " action="page_general_search_3.html" method="POST">
                    <a href="javascript:;" className="remove">
                        <i className="icon-close"></i>
                    </a>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search..." />
                        <span className="input-group-btn">
                            <a href="javascript:;" className="btn submit">
                                <i className="icon-magnifier"></i>
                            </a>
                        </span>
                    </div>
                </form>
            </li>            
        )
    }
}

export default SearchBox