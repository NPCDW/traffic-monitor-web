import axios from "axios";
import {ApiResponse} from "./apiResponse";

export interface AppState {
    config: {
        network_name: string,
        vps_name: string,
        log_level: string,
        web?: {
            listener: string,
            ui_path: string,
            token: string,
        },
        tg?: {
            bot_token: string,
            chat_id: string,
            topic_id: number,
        },
        traffic_cycle?: {
            cycle_type: string,
            each?: number,
            traffic_reset_date?: string,
            start_date?: string,
            end_date?: string,
            traffic_limit: string,
            statistic_method: string,
            exec?: string,
        },
    },
    cycle?: {
        cycle_type: {
          [key: string]: [number | string, string]
        },
        current_cycle_start_date: string,
        current_cycle_end_date: string,
        uplink_traffic_usage: number,
        downlink_traffic_usage: number,
        traffic_limit: number,
        traffic_usage: number,
        notify_exceeds: boolean,
        notify_half: boolean,
        notify_80: boolean,
        notify_90: boolean,
        statistic_method: string,
    },
}

export const cycleStatisticMethodEnum = {
    SumInOut: '双向计算',
    MaxInOut: '入出取大',
    OnlyOut: '只记上行',
}

export class CycleType {
    static DAY = "DAY";
    static MONTH = "MONTH";
    static ONCE = "ONCE";
    type = '';
    interval = 0;
    date = '';
    startDate = '';
    endDate = '';
  
    constructor(args: { [key: string]: [number | string, string] }) {
      for (let val in args) {
        this.type = val;
        switch (val) {
          case CycleType.DAY:
            this.interval = args[val][0] as number; // i64 in Rust is a number in JS
            this.date = args[val][1]; // date can be a Date object
            break;
          case CycleType.MONTH:
            this.interval = args[val][0] as number;
            this.date = args[val][1];
            break;
          case CycleType.ONCE:
            this.startDate = args[val][0] as string;
            this.endDate = args[val][1];
            break;
          default:
            throw new Error("Invalid CycleType");
        }
      }
      }
  }

/**
 * 获取应用状态数据
 */
const get_app_state = () => {
    return axios.get<ApiResponse<AppState>>("/api/app/state");
};

/**
 * 获取版本号
 */
const version = () => {
    return axios.get<ApiResponse<string>>("/api/app/version");
};

export default {
    version, get_app_state
}