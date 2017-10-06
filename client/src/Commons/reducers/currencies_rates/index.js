export default function currencies_rates(state = {}, {type, rates}) {
    switch (type) {
        case 'SET_CURRENCY_RATES':
            return {...rates};
        default:
            return state
    }
}
