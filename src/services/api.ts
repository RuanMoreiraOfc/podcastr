import axios from 'axios';

export interface IApiParams {
    _limit: number;
    _sort: "published_at";
    _order: "desc";
}

const api = axios.create({
    baseURL: 'http://localhost:3333'
});

export default api;