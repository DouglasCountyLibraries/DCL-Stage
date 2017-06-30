
var baseURI = "http:///dev.dclcollections.dcl.lan/";
// <div id="covers-${title}" class ="container shelf-container text-center">

function createPreShelf(title, seq)
{
    var x = `
<div class="row shelf">
 
   <div id="covers-${seq}" class ="container shelf-container text-center">
     <h1 class="no-margin-bottom"><a href="https://stage.dcl.org/list/all.html">${title}</a></h1>
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
 <div class ="row shelf-shadow padding-bottom-30">
   
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
const markup = `
<ul class="dogs">
    ${dogs.map(dog => `<li>${dog.name} is ${dog.age * 7}</li>`)}
</ul>
`;
var collData;
$(document).ready(function () {
   // $('#gen').append(preShelf);
    // console.log(markup);
   // $("#header").load("DCLHeader.html");
    getCollectionSet();
  //  console.log('return from getCollection',collData);
});  // end document ready
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
            console.log('w', createPreShelf(title, i));
         
            var myel = $('#gen').append(createPreShelf(title,i));
            console.log('val', val.KeyName)
            getRandomCollectionList(val.KeyName,i);
            $('#gen').append(createPostShelves(title));
        });

    });
    promise.fail(function (data, status) {
       // swal("Problem With Request", data.responseText, "error");
        console.log("Problem With Request", data.responseText, "error");
    });
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
                if (divid == 1) {
                    $('#covers-1').append(createBookList(val));
                }
                if (divid == 0) {
                    $('#covers-0').append(createBookList(val));
                }
                if (divid == 2) {
                    $('#covers-2').append(createBookList(val));
                }
                if (divid == 3) {
                    $('#covers-3').append(createBookList(val));
                }

               
                console.log('val', val.Title)
            });

        });
        promise.fail(function (data, status) {
            //swal("Problem With Request", data.responseText, "error");
            console.log("Problem With Request", data.responseText, "error")
        });

    }
}
function createBookList(val) {
    var x;
    var bib = val.Bib + 114;
    if (val.FoundImage == true)
    {
        x = `
     <a href="https://dcl.bibliocommons.com/item/show/${bib}"><img class ="cover-image" src="https://secure.syndetics.com/index.aspx?isbn=${val.Isbn}/LC.GIF" alt=${val.title}>
      `;
    }
    else
    {

        x = `
       <a href="https://dcl.bibliocommons.com/item/show/${bib}"><img class ="cover-image" src="${baseURI}/api/images/${val.Isbn}" alt=${val.title}>
      `;
    }
       
  
    return x;
}