

//var baseURI = "http:///dev.dclcollections.dcl.lan/";
var baseURI = "https://dclcollections.douglascountylibraries.org/";
// <div id="covers-${title}" class ="container shelf-container text-center

var allKeyName;



function createAllPageTitle(title)
{
  var x = [
     '<div class="text-center">',
      '<h1 class="jumbo-text text-uppercase font-weight-400">What' + "'s"  + 'New</h1>',
      '<div class="separator-container padding-bottom-15">',
       ' <div class="separator line-separator"><i class="fa fa-star-o"></i></div>',
     ' </div>',
   ' </div>',
     ' <h1 class="no-margin">' + title + '</h1>  '
	 ].join('\n');
      
    return x;
}
function getBiblioHref(keyName)
{
    var h = '';
    if (keyName == "Noteworthy") {
        h = "https://dcl.bibliocommons.com/list/share/692278051_dcladults/1039845827";
    }
    return h;
}
//class="elastislide-list"
//class ="container shelf-container text-center"

function createPreShelf(title, keyName, seq) {
    var hr = getBiblioHref(keyName);
    var x = [
    '<div class="row shelf">',
   '<div id="covers-outer" class ="container shelf-container text-center">',
    '<ul id="covers-' + keyName + '">'
     ].join('\n');
    return x;
}
//<ul id="covers-${keyName}" class ="elastislide-list">
function createPostShelves(title) {
    var x = [
       ' </ul>',
 '</div>'
  ].join('\n');
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
   

    //});
    //  console.log('return from getCollection',collData);
});  // end document ready
function doBiblioList(val) {
    //Noteworthy|New & Noteworthy||5|True|Biblio|975832667|10
    //ListenToThis|Listen To This||5|True|Biblio|963743517|10
    //NowFeaturing|Now Featuring||5|True|Biblio|/991669947|24
    //EpicReads|Epic Reads||5|True|Biblio|994069717|10
    title = val.DisplayName;
    if (val.KeyName == 'Noteworthy') {
        var myel = $('#Noteworthy').append(createPreShelf(title, val.KeyName, '10'));
        console.log('val', val.KeyName)
        getRandomCollectionList(val.KeyName, '10');
        $('#Noteworthy').append(createPostShelves(title));
    }
    if (val.KeyName == 'ListenToThis') {
        var myel = $('#ListenToThis').append(createPreShelf(title, val.KeyName, '10'));
        console.log('val', val.KeyName)
        getRandomCollectionList(val.KeyName, '10');
        $('#ListenToThis').append(createPostShelves(title));
    }
    if (val.KeyName == 'NowFeaturing') {
        var myel = $('#NowFeaturing').append(createPreShelf(title, val.KeyName, '10'));
        console.log('val', val.KeyName)
        getRandomCollectionList(val.KeyName, '10');
        $('#NowFeaturing').append(createPostShelves(title));
    }
    if (val.KeyName == 'StorytimeFavorites') {
        var myel = $('#StorytimeFavorites').append(createPreShelf(title, val.KeyName, '10'));
        console.log('val', val.KeyName)
        getRandomCollectionList(val.KeyName, '10');
        $('#StorytimeFavorites').append(createPostShelves(title));
    }
    if (val.KeyName == 'EpicReads') {
        var myel = $('#EpicReads').append(createPreShelf(title, val.KeyName, '10'));
        console.log('val', val.KeyName)
        getRandomCollectionList(val.KeyName, '10');
        $('#EpicReads').append(createPostShelves(title));
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
            if (val.ListType == 'WhatsNew') {
                var myel = $('#gen').append(createPreShelf(title, val.KeyName, i));
                console.log('val', val.KeyName)
                getRandomCollectionList(val.KeyName, i);
                $('#gen').append(createPostShelves(title));
            }
            else {
                //var myel = $('#Noteworthy').append(createPreShelf(title, val.KeyName, i));
                //console.log('val', val.KeyName)
                //getRandomCollectionList(val.KeyName, 10);
                //$('#Noteworthy').append(createPostShelves(title));
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
                $('#covers-0').append(createBookList(val, KeyName));
            }
            if (divid == 1) {
                $('#covers-1').append(createBookList(val, KeyName));
            }
            if (divid == 2) {
                $('#covers-2').append(createBookList(val, KeyName));
            }
            if (divid == 3) {
                $('#covers-3').append(createBookList(val, KeyName));
            }
            if (divid == 10) {
                if (KeyName == "Noteworthy") {
                    $('#covers-Noteworthy').append(createBookList(val, KeyName));
                }
                if (KeyName == "NowFeaturing") {
                    $('#covers-NowFeaturing').append(createBookList(val, KeyName));
                }
                if (KeyName == "StorytimeFavorites") {
                    $('#covers-StorytimeFavorites').append(createBookList(val, KeyName));
                }
                if (KeyName == "ListenToThis") {
                    $('#covers-ListenToThis').append(createBookList(val, KeyName));
                }
                if (KeyName == "EpicReads") {
                    $('#covers-EpicReads').append(createBookList(val, KeyName));
                }
              
            }

            console.log('val', val.Title)
        });

    });
    promise.fail(function (data, status) {
        //swal("Problem With Request", data.responseText, "error");
        console.log("Problem With Request", data.responseText, "error")
    });
}
function getlargeList(KeyName, Title) {

    var uri = baseURI + 'api/collectionlist/GetCollectionList/' + KeyName;
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

            $('#largeCoverList').append(createBookList(val, KeyName));


            console.log('val', val.Title)
        });
        //$("#covers-Noteworthy").elastislide({
        //    minItems: 5

        //});
    });
    promise.fail(function (data, status) {
        //swal("Problem With Request", data.responseText, "error");
        console.log("Problem With Request", data.responseText, "error")
    });

}
function createBookList(val,KeyName) {
    var x;
    //  var bib = val.Bib + 114;
    var bib = val.Bib ;
	
    if (val.ImageSource == 'Syndetics' || val.ImageSource == 'Biblio')
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

/* function createBookList(val, KeyName) {
    var x;
    var dolist = false;
  //  var bib = val.Bib + 114;
    var bib = val.Bib ;
    if (dolist) {
        x = `
          <li><a href="https://dcl.bibliocommons.com/item/show/${bib}"><img class ="cover-image" src="https://secure.syndetics.com/index.aspx?isbn=${val.Isbn}/LC.GIF" alt="${val.title}"/></a></li>
      `;
    }
    else {
        x = `
         <a href="https://dcl.bibliocommons.com/item/show/${bib}"><img class ="cover-image" src="https://secure.syndetics.com/index.aspx?isbn=${val.Isbn}/LC.GIF" alt="${val.title}"/></a>
      `;
     
    }
         
      
    return x;
} */