export const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    let flag = 1;
    if (bytes < 0) {
        bytes = -bytes
        flag = -1;
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) * flag + ' ' + (sizes[i] ? sizes[i] : '');
}

export const daysBetweenDates = (dateStr1: string, dateStr2: string) => {
    // 将字符串日期转换为Date对象
    let dateObj1 = new Date(dateStr1);
    let dateObj2 = new Date(dateStr2);

    // 检查是否成功解析了日期
    if (isNaN(dateObj1.getTime()) || isNaN(dateObj2.getTime())) {
        throw new Error('Invalid date string');
    }

    // 计算时间差（以毫秒为单位）
    let timeDiff = Math.abs(dateObj2.getTime() - dateObj1.getTime());

    // 转换为天数
    let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
}

export const formatDate = (date: Date) => {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份是从0开始的，所以加1，并保证两位数
    var day = ('0' + date.getDate()).slice(-2);           // 保证日期是两位数
    return year + '-' + month + '-' + day;
}

// 定义一个格式化日期的函数
export const formatDateTime = (datetime: Date) => {
    var year = datetime.getFullYear();
    var month = ('0' + (datetime.getMonth() + 1)).slice(-2); // 月份是从0开始的，所以加1，并保证两位数
    var day = ('0' + datetime.getDate()).slice(-2);
    var hours = ('0' + datetime.getHours()).slice(-2);
    var minutes = ('0' + datetime.getMinutes()).slice(-2);
    var second = ('0' + datetime.getSeconds()).slice(-2);
    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + second;
}
