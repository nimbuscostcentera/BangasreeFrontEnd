
function NumberOnly(num) {
  var isNum = /^\d*\.?\d{0,2}$/;
  var Num = isNum.test(num);
  if (Num) {
    return true;
  } else {
    return false;
  }
}

export default NumberOnly;
