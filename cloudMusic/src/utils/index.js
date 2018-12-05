function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
export default {
  formatNumber,
  formatTime,
  formatterDuration: (duration) => {
    let time = '';
    let mininus = '';
    let hour = parseInt(duration / 60 / 60);
    hour = hour > 0 ? hour < 10 ? '0' + hour : hour : 0;
    if(hour > 0) {
      mininus = parseInt(duration / (hour * 60 )) < 10 ? '0' +  parseInt(duration / (hour * 60)) : parseInt(duration / (hour * 60));
    } else {
      mininus = parseInt(duration / 60) < 10 ? '0' +  parseInt(duration / 60) : parseInt(duration / 60);
    }
    let sec = parseInt(duration % 60) < 10 ? '0' + parseInt(duration % 60) : parseInt(duration % 60);
    time = hour > 0 ? hour + ':' + mininus + ':' + sec : mininus + ':' + sec;
    return time;
  },
  formatterTime: function (time) {
    let currentTime = new Date(time);
    let year = currentTime.getFullYear();
    let month = currentTime.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = currentTime.getDay();
    day = day < 10 ? '0' + day : day;
    return year + '年' + month + '月' + day + '日';
  },
  timeToSec: function(time) {
    let hour = parseInt(time.substr(0,1));
    let minute = parseInt(time.substr(1,2));
    let sec = parseInt(time.substr(3,5));
    return (hour * 10 + minute) * 60 + sec;
  },
  formatPlayCount: function(count) {
    return count > 10000 ? parseInt(count / 10000) + '万' : count + '人'
  },
  subStrCount: function(str, maxCount) {
    str = str.trim().length > maxCount ? str.trim().substr(0,maxCount) + '...' : str;
    return str;
  }
}
