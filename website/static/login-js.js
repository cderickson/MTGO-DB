function confirmHidden() {
  document.getElementById("confirm_email").value = document.getElementById("login_email").value;
  document.getElementById("confirm_pwd").value = document.getElementById("login_pwd").value;
};

function resetPassModal() {
  if (document.getElementById("login_email").value == '') {
    document.getElementById("ResetPassBody").innerHTML = "<b>No email address entered.</b>"
    document.getElementById("resetSubmitButton").disabled = true;
  } else {
    document.getElementById("ResetPassBody").innerHTML = "<b>" + document.getElementById("login_email").value + "</b>"
    document.getElementById("resetSubmitButton").disabled = false;
  }
  document.getElementById("reset_email").value = document.getElementById("login_email").value
};