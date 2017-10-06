import LocaleUtils from 'react-day-picker/moment'

const swalConfirm = {
    title: 'Confirma?',
    type: 'warning',            
    showCancelButton: true, 
    cancelButtonColor: '#ed6b75',
    cancelButtonText: 'No',   
    confirmButtonText: 'Si',
    confirmButtonColor: '#659be0',
};

const config = {
    defaults: {
        country: 1 //'Argentina'
    },
    dates: {
        dayPickerProps: {
            todayButton: 'Hoy',
            locale: "es",
            localeUtils: LocaleUtils,
            enableOutsideDays: true,
        },
        visual_format: "DD/MM/YYYY",
        storage_format: "YYYY-MM-DD"
    },
    tables: {
        defaults: {
            placeholder: 'Buscar...',
            noDataText: 'Sin resultados',
            sizePerPage: 10
        },        
        swalConfirm,
        onDeleteSwal: {
            ...swalConfirm,
            title: 'Confirma?',
            text: "Se eliminará el item",
        },
    }
}
export default config