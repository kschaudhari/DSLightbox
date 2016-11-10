
function lbclose() {
    
//    window.location.hash = "#/section/2";
}
function lbopen() {
    console.log("LB OPEN");

    loadPage();
    var axel = Math.random() + "";
    var a = axel * 10000000000000;
    document.write('<iframe src="https://5411306.fls.doubleclick.net/activityi;src=5411306;type=swaro0;cat=swaro0;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=' + a + '?" width="1" height="1" frameborder="0" style="display:none"></iframe>');

	//window.location.hash = "#/section/1";
   // dataLayer.push({
	//    'event': 'lightbox_open'
	//})
}
function loadPage()
{
    var type = window.location.hash.substr(1);
    if (!type)
        type = "tab1";
    var src = "overview";
    switch (type) {
        case 'tab2':
            src = "city";
            break;
        case 'tab3':
            src = "coast";
            break;
        case 'tab4':
            src = "nature";
            break;
        case 'tab5':
            src = "scenery";
            break;
        case 'tab6':
            src = "product";
            break;
    }
    $(".MainWrapper iframe.view").attr("src", src + ".html")
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
