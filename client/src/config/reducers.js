import { combineReducers } from 'redux'
import session from '../Session/reducers'
import users from '../Users/reducers'
import countries from '../Commons/reducers/countries'
import enterprises from '../Enterprises/reducers'
import providers from '../Providers/reducers'
import products from '../Products/reducers'
import families from '../Commons/reducers/families'
import sectors from '../Sectors/reducers'
import contacts from '../Contacts/reducers'
import interactions from '../Interactions/reducers'
import currencies from '../Commons/reducers/currencies'
import currencies_rates from '../Commons/reducers/currencies_rates'
import tasks from '../Tasks/reducers'
import sales from '../Sales/reducers'
import flashMessages from '../FlashMessages/reducers';

/**
 * Combine reducers
 */
export default combineReducers({
  contacts,
  countries,
  currencies,
  enterprises,
  families,
  flashMessages,
  interactions,
  products,
  providers,
  sales,
  sectors,
  session,
  tasks,
  users,
  currencies_rates
})

/**
 * store skeleton draft
 * FYI:
 * - selected: is used for edition.
 * - nested elements like country/provinces are laisy loaded and cached.
 */
let storeTree = {
  profile: {},
  users: {
    list: [],
    selected: ''
  },
  countries: {
    list: [{
      // ...data,
      provinces: []
    }, {
      // ...data,
      provinces: []
    }],
    selected: ''
  },
  enterprises: {
    filters: [
      { country: '' },
      { type: '' },
    ],
    list: [],
    selected: '',
    sectors: {
      list: [],
      selected: ''
    },
    contacts: {
      list: [],
      selected: {},
      interactions: {
        list: [],
        selected: {}
      }
    }
  },
  providers: {
    list: [],
    selected: ''
  },
  products: {
    list: [],
    selected: ''
  },
  families: {
    list: [{
      // ...data,
      groups: []
    }, {
      // ...data,
      groups: []
    }],
    selected: ''
  }
}
