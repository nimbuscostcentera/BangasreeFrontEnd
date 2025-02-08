import React from "react";

function IntegerValidation(num) {
  var isNum = /^[0-9]*$/;
  var Num = isNum.test(num);
  if (Num) {
    return true;
  } else {
    return false;
  }
}

export default IntegerValidation;
