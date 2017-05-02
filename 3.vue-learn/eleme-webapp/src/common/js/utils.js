export function dateFormat(date, fmt) {
  let year = date.getFullYear() + '';
  fmt = fmt.replace(/(y+)/, function(match) {
    return year.substr(4 - match.length);
  });
  let others = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let key of Object.keys(others)) {
    fmt = fmt.replace(new RegExp(`(${key})`), function(match) {
      return paddingStart(others[key] + '', match.length, '0');
    });
  }
  return fmt;
};
function paddingStart(str, len, char) {
  if (str.length >= len) {
    return str;
  }
  return new Array(len + 1 - str.length).join(char) + str;
}
