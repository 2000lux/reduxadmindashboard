import guid from '../../Commons/utils/guid'

export const FLASH_MESSAGE = 'FLASH_MESSAGE';
export const REMOVE_FLASH_MESSAGE = 'REMOVE_FLASH_MESSAGE';
export const VIEWED_FLASH_MESSAGE = 'VIEWED_FLASH_MESSAGE';
export const CLEANUP_FLASH_MESSAGES = 'CLEANUP_FLASH_MESSAGES';

const addFlashMessage = (message) => {

    message.id = guid(); // unique ID
  
    return {
        type: FLASH_MESSAGE,
        payload: {
            message
        }
    }
};

export const removeFlashMessage = (id) => {
   
    return {
        type: REMOVE_FLASH_MESSAGE, 
        payload: { id }
    }
};

export const markAsViewed = (id) => {

    return {
        type: VIEWED_FLASH_MESSAGE, 
        payload: { id }
    }
};

export const cleanupFlashMessages = () => {

    return {
        type: CLEANUP_FLASH_MESSAGES
    }
};

export default addFlashMessage