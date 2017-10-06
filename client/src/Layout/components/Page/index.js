import React, { Component } from 'react'
import {Switch, Route} from 'react-router-dom'
import PageBar from '../Pagebar'
import Routes from '../../../config/routes.js'

const Page = () => {
       
        return (          
            <div className="page-content-wrapper">
                <div className="page-content">
                    { Routes }
                </div>
            </div>  
        );
}

export default Page