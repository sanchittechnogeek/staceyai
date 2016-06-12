// You can get your username and user key from your Developer Portal
// You must have already created and compiled a bot before you can talk to it
var pb = new Pandorabot("aiaas.pandorabots.com", 1409612749579, "stacey", "f757ed500df31326ad60e3e5b765a404");
function doTalk() {
  var input = document.getElementById("yousay").value;
  document.getElementById("yousay").value = "";
  pb.talk(input, function(data) {
    var response = data["responses"];
    document.getElementById("response").innerHTML = response;
    console.log(response);
  });
}
