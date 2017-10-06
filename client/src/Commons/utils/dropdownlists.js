/**
 * 
 * Maps a list of items to the three keys used by `react-select`
 * 
 * By default searchs for 'id' and 'name'. That's enough. 
 * But if your 'name' field is named something else, like 'fullname' 
 * you can easily pass that key as a second params to the function.
 * 
 * mapForDropdownList(products, {label: 'fullname'});
 * 
 * If you need more data available when you select the item from dropdown, use:
 * 
 * mapForDropdownList(products, {extra: 'price'});
 * 
 * or pass an array of fields. All of them will be available. 
 * 
 * mapForDropdownList(products, {extra: ['currency', 'price']});
 * 
 * @param {array} list 
 * @param {obj} params contains one or more extra keys to be retrieved. 
 */
export function mapForDropdownList(list, params) {

    // merge default with params
    const objectKeys = Object.assign({
        id: 'id',
        label: 'name',
        value: 'id'        
    }, params)

    return Object.values(list).map((item)=>{

        const data = {
            id: item[objectKeys.id],
            label: item[objectKeys.label],
            value: item[objectKeys.value]
        }

        if(typeof objectKeys.extra != 'undefined') {

            const extra_keys = [].concat(objectKeys.extra);

            extra_keys.forEach(x=>{
                data[x] = item[x]; // arbitrary data
            })
        }
            
        return data;
    })
}