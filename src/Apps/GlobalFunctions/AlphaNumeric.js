function AlphaNumeric(params) {
  var isAlpNum = /^[A-Za-z 0-9\-]*$/;
  var resp = isAlpNum.test(params);
  if (resp) {
    return true;
  } else {
    return false;
  }
}

export default AlphaNumeric;
