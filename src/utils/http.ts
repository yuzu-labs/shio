import axios from 'axios';
import { API_HOST } from './config';

const axiosClient = axios.create({ baseURL: API_HOST });

export default axiosClient;
