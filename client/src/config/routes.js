import {Switch, Route, Redirect} from 'react-router-dom'
import React, { Component } from 'react'

import Enterprises from '../Enterprises/hoc'
import EnterpriseForm from '../Enterprises/hoc/form'

import Sectors from '../Sectors/hoc'
import Contacts from '../Contacts/hoc'
import ContactsForm from '../Contacts/hoc/form'

import { EnterpriseInteractions } from '../Interactions/hoc/enterpriseList'
import EnterpriseInteractionsForm from '../Interactions/hoc/form'

import Providers from '../Providers/hoc'
import ProviderForm from '../Providers/hoc/form'

import Products from '../Products/hoc'
import ProductForm from '../Products/hoc/form'

import Sales from '../Sales/hoc'
import SalesForm from '../Sales/hoc/form'

import Users from '../Users/hoc'
import Tasks from '../Tasks/hoc'
import TasksForm from '../Tasks/hoc/form'
import TaskDetails from '../Tasks/hoc/detail'

import WorkInProgress from '../Layout/components/WorkInProgress'
import Logout from '../Session/hoc/Logout'

const Routes = (
    <Switch>
        <Route path="/logout" component={Logout} />  

        <Route exact path="/" render={() => (           
            <Redirect to="/empresas"/>          
        )} />  

        <Route exact path="/empresas" component={Enterprises} />
        <Route exact path="/empresas/alta" component={EnterpriseForm} />
        <Route path="/empresas/:id/edicion" component={EnterpriseForm} />
        <Route path="/empresas/:id/sectores" component={Sectors} />
        
        <Route exact path="/empresas/:enterprise_id/interacciones" component={EnterpriseInteractions} />
        <Route path="/empresas/:enterprise_id/contactos/:contact_id/interacciones" component={EnterpriseInteractions} />
        <Route path="/empresas/:enterprise_id/interacciones/:interaction_id/edicion" component={EnterpriseInteractionsForm} />
        <Route path="/empresas/:enterprise_id/interacciones/alta" component={EnterpriseInteractionsForm} />

        <Route exact path="/empresas/contactos" component={Contacts} />    
        <Route path="/empresas/contactos/alta" component={ContactsForm} />    
        <Route path="/empresas/:enterprise_id/contactos/:contact_id/edicion" component={ContactsForm} />    

        <Route exact path="/proveedores" component={Providers} />
        <Route exact path="/proveedores/alta" component={ProviderForm} />
        <Route path="/proveedores/:id/edicion" component={ProviderForm} />
        <Route path="/proveedores/:id/contactos" component={WorkInProgress} />
        <Route path="/proveedores/:id/interacciones" component={WorkInProgress} />

        <Route exact path="/productos" component={Products} />
        <Route exact path="/productos/alta" component={ProductForm} />
        <Route path="/productos/:id/edicion" component={ProductForm} />

        <Route exact path="/ventas" component={Sales} />
        <Route exact path="/ventas/alta" component={SalesForm} />
        <Route exact path="/ventas/:id/edicion" component={SalesForm} />

        <Route exact path="/usuarios" component={Users} />

        <Route exact path="/tareas" component={Tasks} />
        <Route exact path="/tareas/alta" component={TasksForm} />
        <Route exact path="/tareas/:id/edicion" component={TasksForm} />
        <Route exact path="/tareas/:id/detalle" component={TaskDetails} />
    </Switch>    
)

export default Routes