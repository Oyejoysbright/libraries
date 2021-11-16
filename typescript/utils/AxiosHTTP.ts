import axios from 'axios';
import { TCallback, IObjectMap } from '../Interfaces';
import { TResponseType } from '../interfaces/net';

type TAxios = {
    method: "POST" | "PUT" | "DELETE" | "GET",
    baseUrl?: string,
    url?: string,
    data?: any,
    onSuccess: TCallback | any,
    onFailure: TCallback | any,
    headers?: Record<string,string>,
    responseType?: TResponseType
}

export const axiosHttp = (request: TAxios) => {
    axios.request({
        responseType: request.responseType ?? "json",
        method: request.method,
        baseURL: request.baseUrl,
        url: request.url,
        headers: request.headers,
        data: request.data
    }).then(request.onSuccess).catch(request.onFailure);
}

export interface IAxiosHTTPResponse<T> {
    data: T;
    status: number;
    statusText: string;
    header: IObjectMap;
    config: IObjectMap;
}

export interface IAxiosHTTPError {
    status: number;
    reason: string;
    body: string;
}