
function PasswordValidation(Password) {
  // var [Error, setError] = useState([]);
  // var err = [];
  // var errmsg1 = "";
  // var errmsg2 = "";
  // var errmsg3 = "";
  // var errmsg4 = "";
  // var errmsg5 = "";
  // var Status, msg;
  var isNum = /\d/;
  var Num = isNum.test(Password);
  var isUpper = /[A-Z]/;
  var Upper = isUpper.test(Password);
  var isLower = /[a-z]/;
  var Lower = isLower.test(Password);
  var isSpecial = /[!@#$%^&*_+|:<>?]/;
  var Special = isSpecial.test(Password);
  var isSpace = /\s/;
  var Space = isSpace.test(Password);

  if (Num && Upper && Lower && Special && !Space === true) {

    return true;
  }
  else{
    return false
  }
}

export default PasswordValidation;
