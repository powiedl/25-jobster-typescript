import axios from 'axios';
import { Job } from './types';

export const customFetch = axios.create({
  baseURL: 'https://redux-toolkit-jobster-api-server.onrender.com/api/v1',
});

export interface ApiJobsType {
  jobs: Job[];
  totalJobs: number;
  numOfPages: number;
}
