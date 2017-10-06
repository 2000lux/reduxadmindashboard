const API_KEY = '4585141eda7842b23fa77e16736816c3'

export const setCurrencyRates = rates => ({
  type: 'SET_CURRENCY_RATES',
  rates
})

export const getCurrencyRates = dispatch => {
  return fetch(`http://www.apilayer.net/api/live?access_key=${API_KEY}&source=USD&currencies=ARS&format=1`)
    .then(res => res.json())
    .then(res => {
      dispatch(setCurrencyRates({...res.quotes}))
    })
}
