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
        cycle_type: string,
        current_cycle_start_date: string,
        current_cycle_end_date: string,
        uplink_traffic_usage: number,
        downlink_traffic_usage: number,
        traffic_limit: number,
        notify_exceeds: boolean,
        notify_half: boolean,
        notify_80: boolean,
        notify_90: boolean,
        statistic_method: CycleStatisticMethod,
    },
}

enum CycleStatisticMethod {
    SumInOut,
    MaxInOut,
    OnlyOut,
}

class CycleType {
    static DAY = "DAY";
    static MONTH = "MONTH";
    static ONCE = "ONCE";
    type = '';
    interval = 0;
    date = '';
    startDate = '';
    endDate = '';
  
    constructor(type: string, ...args: any[]) {
      this.type = type;
  
      switch (type) {
        case CycleType.DAY:
          this.interval = args[0]; // i64 in Rust is a number in JS
          this.date = args[1]; // date can be a Date object
          break;
        case CycleType.MONTH:
          this.interval = args[0];
          this.date = args[1];
          break;
        case CycleType.ONCE:
          this.startDate = args[0];
          this.endDate = args[1];
          break;
        default:
          throw new Error("Invalid CycleType");
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