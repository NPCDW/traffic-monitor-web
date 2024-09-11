import axios from "axios";
import {ApiResponse} from "./apiResponse";

export interface MonitorDay {
    id: number,
    create_time: string,
    day: string,
    uplink_traffic_usage: number,
    downlink_traffic_usage: number,
}

export interface MonitorHour {
    id: number,
    create_time: string,
    day: string,
    hour: number,
    uplink_traffic_usage: number,
    downlink_traffic_usage: number,
}

export interface MonitorSecond {
    id: number,
    create_time: string,
    start_time: string,
    end_time: string,
    uplink_traffic_readings: number,
    downlink_traffic_readings: number,
    uplink_traffic_usage: number,
    downlink_traffic_usage: number,
    time_interval: number,
    is_corrected: number,
}

/**
 * 查询天监控数据
 */
const list_traffic_day = (body: {start_date: string, end_date: string}) => {
    return axios.post<ApiResponse<MonitorDay[]>>("/api/traffic/day", body);
};

/**
 * 查询小时监控数据
 */
const list_traffic_hour = (body: {day: string}) => {
    return axios.post<ApiResponse<MonitorHour[]>>("/api/traffic/hour", body);
};

/**
 * 查询秒监控数据
 */
const list_traffic_second = (body: {start_time: string, end_time: string}) => {
    return axios.post<ApiResponse<MonitorSecond[]>>("/api/traffic/second", body);
};

export default {
    list_traffic_day, list_traffic_hour, list_traffic_second
}