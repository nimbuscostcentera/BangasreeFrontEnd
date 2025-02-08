import React from "react";

function PinCodeValidation(num) {
  var isNum = /^[1-9][0-9]{5}$/;
  var Num = isNum.test(num);
  if (Num) {
    return true;
  } else {
    return false;
  }
}

export default PinCodeValidation;;
