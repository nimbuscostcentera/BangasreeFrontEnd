function WeightOnly(num) {
  var isNum = /^\d*\.?\d{0,3}$/;
  var Num = isNum.test(num);
  if (Num) {
    return true;
  } else {
    return false;
  }
}

export default WeightOnly;
