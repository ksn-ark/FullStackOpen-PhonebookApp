import axios from "axios";
const baseUrl = "/persons";

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (newPersonObject) => {
  const request = axios.post(baseUrl, newPersonObject);
  const response = await request;
  return response.data;
};

const deleteEntry = (personObject) => {
  const request = axios.delete(`${baseUrl}/${personObject.id}`);
  return request;
};

const update = async (editedObject) => {
  const request = axios.put(`${baseUrl}/${editedObject.id}`, editedObject);
  const response = await request;
  return response.data;
};

export default { getAll, create, deleteEntry, update };
