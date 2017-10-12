
//var baseURI = "http:///dev.dclcollections.dcl.lan/";
var baseURI = "https://dclcollections.douglascountylibraries.org/";
var baseDCLOrgURI = "https://www.dcl.org/whats-new/";
// <div id="covers-${title}" class ="container shelf-container text-center
var a = window.location.toString(); 
var allKeyName;
if (a.indexOf('=') > -1)
{

   allKeyName  = getUrlParameter("key");
   title = getUrlParameter("title");
   console.log("allKeyName name  is ", allKeyName,"title name  is ", title, "a ", a);
}

function getUrlParameter(name) { 
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function createAllPageTitle(title)
{
  var x = [
     '<div class="text-center">',
      '<h1 class="jumbo-text text-uppercase font-weight-400">What&#39;s New</h1>',
      '<div class="separator-container padding-bottom-15">',
       ' <div class="separator line-separator"><i class="fa fa-star-o"></i></div>',
     ' </div>',
   ' </div>',
     ' <h1 class="no-margin">' + title + '</h1>  '
	 ].join('\n');
      
    return x;
}
function createPreShelf(title, keyName, seq)
{
	var decodedTitle = title.replace(/%26/g, "&");;
    var x = [
    '<div class="row shelf">',
 
  ' <div id="covers-' + seq + '" class ="container shelf-container text-center"> ',
    ' <h1 class="no-margin"><a href="all.html?key=' + keyName + '&title=' + title + '">' +decodedTitle+ '</a></h1> ',
		' <div><a class="text-uppercase" href="all.html?key=' + keyName + '&title=' + title + '">See Entire List &raquo;</a></div></div> '
	].join('\n');
    return x;
}

function createPostShelves(title, keyName)
{
    var x = [
 '</div>',
 '<div class ="row shelf-shadow padding-bottom-80">',
 '<div style="text-align:center; padding-top:0.1cm">',
' </div>',
 ].join('\n');

    return x;
}
   

var collData;
$(document).ready(function () {

    getCollectionSet();
	if (allKeyName != undefined) { 
    getlargeList(allKeyName, title);
}
  //  console.log('return from getCollection',collData);
});  // end document ready

function doBiblioList(val)
{

 title = val.DisplayName;
	if (val.KeyName == 'Noteworthy' )
	{
		 var myel = $('#Noteworthy').append(createPreShelf(title,val.KeyName,'10'));
            console.log('val', val.KeyName)
            getRandomCollectionList(val.KeyName,'10');
            $('#Noteworthy').append(createPostShelves(title,val.KeyName));
	}
}

function getCollectionSet() {

    var uri = baseURI + 'api/collectionlist/GetCollectionSet/WhatsNew';
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
       // console.log(jdata, jsonData)
        collData = jdata;
        jQuery.each(jsonData, function (i, val) {
            //  $("#" + i).append(document.createTextNode(" - " + val));
            title = val.DisplayName;
         //   console.log('val', val.DisplayName)
         //   console.log('i', i)
         //  console.log('w', createPreShelf(title, val.KeyName, i));
         if	(val.ListType == 'WhatsNew')
		 {
            var myel = $('#gen').append(createPreShelf(title,val.KeyName,i));
           // console.log('val', val.KeyName)
            getRandomCollectionList(val.KeyName,i);
            $('#gen').append(createPostShelves(title,val.KeyName));
		 }
		 else {
			 doBiblioList(val);
		 }
        });

    });
    promise.fail(function (data, status) {
       
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
           // console.log('covers', jdata, jsonData)
          //  console.log('setTitle', setTitle)
            collData = jdata;
          //  var divid =  divid;
            jQuery.each(jsonData, function (i, val) {
                //  $("#" + i).append(document.createTextNode(" - " + val));
                isbn = val.Isbn;
               // console.log('setTitle', setTitle)
               
               // console.log('val', val.Isbn)

              //  console.log('divid', divid)
               
               
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

               
               // console.log('val', val.Title)
            });

        });
        promise.fail(function (data, status) {
            
            console.log("Problem With Request", data.responseText, "error")
        });
}
function getlargeList(KeyName,Title) {

        var uri = baseURI + 'api/collectionlist/GetCollectionList/' + KeyName ;
		
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
               
                //console.log('val', val.Isbn)

              $('#largeCoverList').append(createBookList(val,KeyName));
             
              // console.log('val', val.Title)
            });

        });
        promise.fail(function (data, status) {
          
            console.log("Problem With Request", data.responseText, "error")
        });

    }

function createBookList(val,KeyName) {
    var x;
    var bib = val.Bib + 114;
	
    if (val.ImageSource == 'Syndetics')
    {
		if (KeyName == 'ComingSoonMovies')
		{
			 x = 
			   ' <a href="https://dcl.bibliocommons.com/item/show/' + bib + '"><img class ="cover-image" src="https://secure.syndetics.com/index.aspx?isbn=/MC.GIF&client=dougp&type=xw12&oclc=&upc=' + val.Isbn + '"alt="' + val.Title +  '"></a>';
		}
		else
		{
         x = ' <a href="https://dcl.bibliocommons.com/item/show/' + bib + '"><img class ="cover-image" src="https://secure.syndetics.com/index.aspx?isbn=' + val.Isbn + '/LC.GIF" alt="' + val.Title + '"></a>';
		}
    }
    else if (val.ImageSource == 'URL')
    {

        x = ' <a href="https://dcl.bibliocommons.com/item/show/' + bib + '"><img class ="cover-image" src="' + val.ImageURL + '" alt=' + val.Title + '"></a>';
    }
	else{
		 x = ' <a href="https://dcl.bibliocommons.com/item/show/' + bib + '"><img class ="cover-image" src="' + baseURI + '/api/images/' + val.Isbn + '" alt="' + val.Title + '"></a>';
	}
       
  
    return x;
}