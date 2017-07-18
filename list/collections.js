
//var baseURI = "http:///dev.dclcollections.dcl.lan/";
var baseURI = "https://dclcollections.douglascountylibraries.org/";
// <div id="covers-${title}" class ="container shelf-container text-center
var a = window.location.toString(); 
var allKeyName;
if (a.indexOf('=') > -1)
{
   allKeyName = a.substring(a.indexOf("=") + 1,a.lastIndexOf("&"));
   title = a.substring(a.indexOf("&") + 7).replace(/%20/g, " ");
   console.log("allKeyName name  is ", allKeyName,"title name  is ", title, "a ", a);
}


function createAllPageTitle(title)
{
    var x = `
     <h1 class="no-margin">${title}</h1>
      `;
    return x;
}
function createPreShelf(title, keyName, seq)
{
    var x = `
<div class="row shelf">
 
   <div id="covers-${seq}" class ="container shelf-container text-center">
     <h1 class="no-margin"><a href="http://stage.dcl.org/list/all.html?key=${keyName}&title=${title}">${title}</a></h1>
      `;
    return x;
}

//function createPreShelves(title)
//{
//    var x = `
// <div class ="row padding-bottom-15 border-top">
//            <div class ="container">
//                <div class ="text-center">
//                    <h1 class ="jumbo-text text-uppercase font-weight-400">${title}</h1>
//                </div>
//                <div class ="row">
//                    <div class ="container text-center"><a class ="text-uppercase" href="https://dcl.bibliocommons.com/explore/featured_lists/staff_picks">View All Staff Picks &raquo; </a></div>
//                </div>
//            </div>
//        </div>
//    `;
//    return x;
//}
function createPostShelves(title)
{
    var x = `
 </div>
 <div class ="row shelf-shadow padding-bottom-60">
   
 </div>
    `;
    return x;
}

//var preShelf = `
// <div class ="row padding-bottom-15 border-top">
//            <div class ="container">
//                <div class ="text-center">
//                    <h1 class ="jumbo-text text-uppercase font-weight-400">${title}</h1>
                   
//                </div>
//                <div class ="row">
//                    <div class ="container text-center"><a class ="text-uppercase" href="https://dcl.bibliocommons.com/explore/featured_lists/staff_picks">View All Staff Picks &raquo; </a></div>
//                </div>
//            </div>
//        </div>
//    `

var collData;
$(document).ready(function () {
   // $('#gen').append(preShelf);
    // console.log(markup);
   // $("#header").load("DCLHeader.html");
    getCollectionSet();
	if (allKeyName != undefined) { 
    getlargeList(allKeyName, title);
}
  //  console.log('return from getCollection',collData);
});  // end document ready
function doBiblioList(val)
{
	//Noteworthy|New & Noteworthy||5|True|Biblio|975832667|10
//ListenToThis|Listen To This||5|True|Biblio|963743517|10
//NowFeaturing|Now Featuring||5|True|Biblio|/991669947|24
//EpicReads|Epic Reads||5|True|Biblio|994069717|10
 title = val.DisplayName;
	if (val.KeyName == 'Noteworthy' )
	{
		 var myel = $('#Noteworthy').append(createPreShelf(title,val.KeyName,'10'));
            console.log('val', val.KeyName)
            getRandomCollectionList(val.KeyName,'10');
            $('#Noteworthy').append(createPostShelves(title));
	}
}
function getCollectionSet() {

    var uri = baseURI + 'api/collectionlist/GetCollectionSet/';
    var promise =
       $.ajax({
           url: uri,
           crossDomain: true,
           processData: false,
           type: 'GET',
           contentType: "application/json"

       });
    promise.done(function (data, status) {

        var jdata = JSON.stringify(data);
        var jsonData = JSON.parse(jdata);
        console.log(jdata, jsonData)
        collData = jdata;
        jQuery.each(jsonData, function (i, val) {
            //  $("#" + i).append(document.createTextNode(" - " + val));
            title = val.DisplayName;
            console.log('val', val.DisplayName)
            console.log('i', i)
            console.log('w', createPreShelf(title, val.KeyName, i));
         if	(val.ListType == 'WhatsNew')
		 {
            var myel = $('#gen').append(createPreShelf(title,val.KeyName,i));
            console.log('val', val.KeyName)
            getRandomCollectionList(val.KeyName,i);
            $('#gen').append(createPostShelves(title));
		 }
		 else {
			 doBiblioList(val);
		 }
        });

    });
    promise.fail(function (data, status) {
       // swal("Problem With Request", data.responseText, "error");
        console.log("Problem With Request", data.responseText, "error");
    });
}
	
    function getRandomCollectionList(KeyName, divid) {

        var uri = baseURI + 'api/collectionlist/GetRandomCollectionList/' + KeyName + '/5';
        var promise =
           $.ajax({
               url: uri,
               crossDomain: true,
               processData: false,
               type: 'GET',
               contentType: "application/json"

           });
        promise.done(function (data, status) {

            var jdata = JSON.stringify(data);
            var jsonData = JSON.parse(jdata);
            console.log('covers', jdata, jsonData)
          //  console.log('setTitle', setTitle)
            collData = jdata;
          //  var divid =  divid;
            jQuery.each(jsonData, function (i, val) {
                //  $("#" + i).append(document.createTextNode(" - " + val));
                isbn = val.Isbn;
               // console.log('setTitle', setTitle)
               
                console.log('val', val.Isbn)

                console.log('divid', divid)
                // $('#' + divid).append(createBookList(isbn));
               
                if (divid == 0) {
                    $('#covers-0').append(createBookList(val,KeyName));
                }
				 if (divid == 1) {
                    $('#covers-1').append(createBookList(val,KeyName));
                }
                if (divid == 2) {
                    $('#covers-2').append(createBookList(val,KeyName));
                }
                if (divid == 3) {
                    $('#covers-3').append(createBookList(val,KeyName));
                }
				 if (divid == 10) {
                    $('#covers-Noteworthy').append(createBookList(val,KeyName));
                }

               
                console.log('val', val.Title)
            });

        });
        promise.fail(function (data, status) {
            //swal("Problem With Request", data.responseText, "error");
            console.log("Problem With Request", data.responseText, "error")
        });
}
function getlargeList(KeyName,Title) {

        var uri = baseURI + 'api/collectionlist/GetCollectionList/' + KeyName ;
		// var uri = baseURI + 'api/collectionlist/GetRandomCollectionList/' + KeyName + '/50';
        var promise =
           $.ajax({
               url: uri,
               crossDomain: true,
               processData: false,
               type: 'GET',
               contentType: "application/json"

           });
        promise.done(function (data, status) {

            var jdata = JSON.stringify(data);
            var jsonData = JSON.parse(jdata);
            console.log('covers', jdata, jsonData)
          //  console.log('setTitle', setTitle)
            collData = jdata;
          //  var divid =  divid;
		   var myel = $('#allCovers').append(createAllPageTitle(Title));
		  createAllPageTitle(Title);
            jQuery.each(jsonData, function (i, val) {
                //  $("#" + i).append(document.createTextNode(" - " + val));
                isbn = val.Isbn;
               // console.log('setTitle', setTitle)
               
                console.log('val', val.Isbn)

              		
                    $('#largeCoverList').append(createBookList(val,KeyName));
             
               
                console.log('val', val.Title)
            });

        });
        promise.fail(function (data, status) {
            //swal("Problem With Request", data.responseText, "error");
            console.log("Problem With Request", data.responseText, "error")
        });

    }

function createBookList(val,KeyName) {
    var x;
    var bib = val.Bib + 114;
	
    if (val.FoundImage == true)
    {
		if (KeyName == 'ComingSoonMovies')
		{
			//https://secure.syndetics.com/index.aspx?isbn=/MC.GIF&client=dougp&type=xw12&oclc=&upc=025192184178
			// https://secure.syndetics.com/index.aspx?isbn=/MC.GIF&client=dougp&type=xw12&oclc=&upc=025192396540
			 x = `
			   <a href="https://dcl.bibliocommons.com/item/show/${bib}"><img class ="cover-image" src="https://secure.syndetics.com/index.aspx?isbn=/MC.GIF&client=dougp&type=xw12&oclc=&upc=${val.Isbn}">
			    `;
		}
		else
		{
        x = `
          <a href="https://dcl.bibliocommons.com/item/show/${bib}"><img class ="cover-image" src="https://secure.syndetics.com/index.aspx?isbn=${val.Isbn}/LC.GIF" alt="${val.title}">
      `;
		}
    }
    else
    {

        x = `
       <a href="https://dcl.bibliocommons.com/item/show/${bib}"><img class ="cover-image" src="${baseURI}/api/images/${val.Isbn}" alt="${val.title}">
      `;
    }
       
  
    return x;
}