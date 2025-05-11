import { getData } from './AxiosService.js';

export const getAllowedAccommodations = async () => {
  try {
    const { data, error } = await getData('/allowedAccommodation');
    if (error) {
      throw new Error(error);
    }
    return { data, error: null }; 
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getAllowedAccommodationById = async (id) => {
  try {
    const { data, error } = await getData(`/allowedAccommodation/${id}`);
    if (error) {
      throw new Error(error);
    }
    return { data, error: null }; 
  } catch (error) {
    return { data: null, error: error.message };
  }
};
