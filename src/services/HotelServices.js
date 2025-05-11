import { postData, putData, getData, deleteData } from "./AxiosService.js"

export const getHotels = async () => {
  try {
    const { data, error } = await getData("/hotels")
    if (error) {
      throw new Error(error)
    }
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const getHotelById = async (id) => {
  try {
    const { data, error } = await getData(`/hotels/${id}`)
    if (error) {
      throw new Error(error)
    }
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const saveOrUpdateHotel = async (hotelData) => {
  const { id } = hotelData
  try {
    if (id) {
      const { data, error } = await putData(`/hotels/${id}`, hotelData)
      if (error) {
        throw new Error(error)
      }
      return { data, error: null }
    } else {
      const { data, error } = await postData("/hotels", hotelData)
      if (error) {
        throw new Error(error)
      }
      return { data, error: null }
    }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const deleteHotel = async (id) => {
  try {
    const { data, error } = await deleteData(`/hotels/${id}`)
    if (error) {
      throw new Error(error)
    }
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}
