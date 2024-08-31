const formatTimeToStr = (times: Date | string | number, pattern: string) => {
  var date = new Date(times);
  var year = String(date.getFullYear());
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  var hours = String(date.getHours()).padStart(2, "0");
  var minutes = String(date.getMinutes()).padStart(2, "0");
  var seconds = String(date.getSeconds()).padStart(2, "0");

  if (pattern) {
    pattern = pattern.replace("yyyy", year);
    pattern = pattern.replace("MM", month);
    pattern = pattern.replace("dd", day);
    pattern = pattern.replace("hh", hours);
    pattern = pattern.replace("mm", minutes);
    pattern = pattern.replace("ss", seconds);
  } else {
    pattern = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return pattern;
};

export const formatDate = (time: string | Date | number) => {
  if (time !== null && time !== "") {
    var date = new Date(time);
    return formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
  } else {
    return "";
  }
};

const formatTimeToHHMMSS = (times: string | Date | number) => {
  var date = new Date(times);
  var hours = String(date.getHours()).padStart(2, "0");
  var minutes = String(date.getMinutes()).padStart(2, "0");
  var seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

export const formatTimestampToHHMMSS = (time: string | Date | number) => {
  if (time !== null && time !== "") {
    var date = new Date(time);
    return formatTimeToHHMMSS(date);
  } else {
    return "";
  }
};
