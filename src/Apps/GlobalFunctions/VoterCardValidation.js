import React from 'react'

function VoterCardValidation(params) {
  var vot = /^[A-Z]{3}[0-9]{7}?$/;
  var votVal = vot.test(params);
  if (votVal) {
    return true;
  } else {
    return false;
  }
}

export default VoterCardValidation