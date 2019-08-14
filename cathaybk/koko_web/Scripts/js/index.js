


$(".videowrap").show()
function setCookie(cookieName, cookieValue, cookieLife) {
  var time = new Date();
  time.setTime(time.getTime() + cookieLife * 60000);
  var expires = "expires=" + time.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function resetCookies() {
  var time = new Date();
  time = time.getTime();
  setCookie("loginStarted", time, 30);
  setCookie("visitCounter", 1, 30);
}

function visitCounter() {
  var visitTime = document.cookie.replace(
    /(?:(?:^|.*;\s*)visitCounter\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  if (visitTime === "") {
    setCookie("visitCounter", 1, 30);
     
  } else {
    setCookie("visitCounter", parseInt(visitTime) + 1, 30);
    console.log(visitTime);
    if (visitTime >= 3) {
     $(".videowrap").remove();
     console.log(visitTime);
    };
  }
}

function checkSessionTime() {
  var currentTime = Date.now();
  var firstTime = document.cookie.replace(
    /(?:(?:^|.*;\s*)loginStarted\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  var sessionTime = (currentTime - firstTime) / 60000;

}



 



