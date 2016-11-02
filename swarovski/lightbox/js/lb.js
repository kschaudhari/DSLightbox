
function lbclose() {
//    window.location.hash = "#/section/2";
}
function lbopen() {
	console.log("LB OPEN");
	//window.location.hash = "#/section/1";
   // dataLayer.push({
	//    'event': 'lightbox_open'
	//})
}
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
	switch (event.data) {
		case "Slide_close":
			lbclose();
			break;
		case "Slide_open":
			lbopen();
			break;
	}
}
