import { Api } from '@reduxjs/toolkit/query';
import { BaseQueryFn, EndpointDefinitions } from '@reduxjs/toolkit/query';

export interface ApiSlice extends Api<
  BaseQueryFn,
  EndpointDefinitions,
  'api',
  never
> {
  reducerPath: 'api';
  endpoints: {};
}

export const apiSlice: ApiSlice; 