
var isAuthorized = false;
var activeTab = null;

var showDebug = true;
//$('#StatusSelected').val('1');

$(document).ready(function () {
    console.log("(document).ready");
   // $('#statusSelect').val('1');
    $('#statusSelect option[value=100]').attr('selected', 'selected');
    activeTab = "registrationTab";
    // $("#materialsRequestForm").validator();
    showLogin();

    var $tabs = $('#tabs').tabs();
    $("a.tabref").click(function () {
        //event code
        console.log("got a tabref click");
        loadTabWindow($(this).attr("href"), $(this).attr("rel"));

    });

    $('[href=#loginTab]').on('shown.bs.tab', function (e) {
        console.log("href=#logninTab isAuth: ", isAuthorized);
        activeTab = "loginTab";
        var tabText = $('#tabpane a[href=#loginTab]').text();
        console.log("activeTab ", activeTab);
        if (tabText == "Logout")
        {
            $('#tabpane a[href=#loginTab]').text("Login");
            document.getElementById("registrationForm").reset();
            isAuthorized = false;
        }
        if (isAuthorized == true) {
            console.log("href=#loginTab");
            $('#tabpane a[href=#loginTab]').text("Logout");
            showLogin();
           // showMaterialRequest();
        }
        else {
            toggleLoginReminder();
            $('#tabs a[href=#loginTab]').text("Login");
            showLogin();
        }
    });
    $('[href=#registrationTab]').on('shown.bs.tab', function (e) {
        console.log("href=#registrationTab isAuth: ", isAuthorized);
        activeTab = "registrationTab";
        console.log("activeTab ", activeTab);
        if (isAuthorized == true) {
            console.log("href=#registrationTab");
            $('#registrationli').click();
            showMaterialRequest();
        }
        else {
            $('#loginli').click();
            toggleLoginReminder();
            
           // showLogin();
        }
    });
    $('[href=#showRequests]').on('shown.bs.tab', function (e) {
        console.log("href=#requestListDiv isAuth: ", isAuthorized);
        activeTab = "showRequests";
        console.log("activeTab ", activeTab);
        if (isAuthorized == true) {
            console.log("href=#requestListDiv");
            showRequestList();
            getFilteredRequests();
        }
        else {
            $('#loginli').click();
            toggleLoginReminder();
           // showLogin();
        }
    });

    $.validator.addMethod("laxEmail", function (value, element) {
        // allow any non-whitespace characters as the host part
        return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@(?:\S{1,63})$/.test(value);
    }, 'Please enter a valid email address.');
   

    $("#materialsRequestForm").validate({
        submitHandler: function () {
            // do other things for a valid form
            getWeekRequestCount();
           // PostMaterialRequest(BuildMaterialRequestData());
        },
        wrapper: 'span',
        rules:{
            'acceptCopyright': {
                required: true,
                equalTo: "#acceptCopyrightYes"
            },
            'email': {
        required: false,
        email: true
    }
        },
        messages: {
            'acceptCopyright': {
                required: 'Agreement must be accepted.',
                equalTo: 'Agreement must be accepted.'
            },
               'email': {
        required: 'Email address required.',
        email: 'Use correct email format.'
    }
        },
        errorPlacement: function (error, element) {
            error.css({ 'padding-left': '10px', 'margin-right': '20px', 'padding-bottom': '2px' });
            error.addClass("arrow")
            error.insertAfter(element);
        }
    });
    $.validator.addMethod("validBarcode2", function (value, element) {
        var result = false;
        if (
       value.match(/(2302500)\d{7}/) || value.match(new RegExp('^\\d{7}$')) || value.match(/(230250)\d{6}-\d{1}/)) {
            result = true;
        }
         

        // allow any non-whitespace characters as the host part
        return this.optional(element) || result;
    }, 'Please enter a valid barcode.');
    $.validator.addMethod("validBarcode", function (value, element) {
        // allow any non-whitespace characters as the host part
        return this.optional(element) || /(2302500\d{7})/.test(value);
    }, 'Please enter a valid barcode.');

    $("#registrationForm").validate({
        submitHandler: function () {
            // do other things for a valid form
            CheckId();
        },
        wrapper: 'span',
        rules: {
            'user_id': {
                required: true,
                validBarcode2: true
                // || id.match(new RegExp('^\\d{7}$')) || id.match(/(230250)\d{6}-\d{1}/)) ,
            },
            'user_pin': {
                required: true,
                digits: true,
                minlength: 4,
                maxlength: 4

            }
        },
        messages: {
            'user_pin': {
                required: 'Pin number is required.',
                digits: 'Pin number is not the correct format.',
                minlength: 'Pin number is not the correct format.',
                maxlength: 'Pin number is not the correct format.'

            },
            'user_id': {
                required: 'Library barcode is required.'
              

            }
        },
        errorPlacement: function (error, element) {
            error.css({ 'padding-left': '10px', 'margin-right': '20px', 'padding-bottom': '2px' });
            error.addClass("arrow")
            error.insertAfter(element);
        }

    });

});

function afterSuccessfulLogin() {
    $('#tabpane a[href=#loginTab]').text("Logout");
    if (activeTab == "registrationTab" || activeTab == "loginTab") {
        $('#registrationli').click();
      
    }
    else 
        {
        $('#showRequestli').click();
    }

}
function showLogout() {
    isAuthorized = false;
    $("#materialsRequest").hide();
    $("#registerDiv").show();
    $("#showRequestsTab").hide();

}
function showLogin() {
    $("#materialsRequest").hide();
    $("#registerDiv").show();
    $("#showRequestsTab").hide();

}
function showRequestList()
{
    $("#materialsRequest").hide();
    $("#registerDiv").hide();
    $("#showRequestsTab").show();

}
function showMaterialRequest() {
     $("#identifiersLegend").hide();
    $("#supplementalDetailsLegend").hide();
    $("#materialsRequest").show();
    $("#registerDiv").hide();
    $("#showRequestsTab").hide();

}
function handleCopyright()
{
    var copyrightChecked = $("input[name=acceptCopyright]:checked").val();
    console.log("copyrightChecked ", copyrightChecked);
    if (copyrightChecked == 1) {
        $("#copyrightReminder").hide();
    } else {
        $("#copyrightReminder").show();
    }
}
            
function SubmitMaterialRequest() {
    $("#materialsRequestForm").validate({
    });
}
function BuildMaterialRequestData() {

    var holdnumber = $("#pickupLocation").val();
    console.log("hold pickup ", holdnumber);
	var illVal = 1;
	if ($("input[name=illItem]:checked").val() == 'false')
	{
		illVal = 0;
	}
    var pData =
            {
                //  UserId: $('#reg_CardNumberForm').val(),
                UserId: $('#reg_CardNumberForm').val(),

                //  Email: $('#email').val(),
                Email: $('#email').val(),
                Format: $('#format').val(),
                //articleField
                MagazineTitle: $('#magazineTitle').val(),
                Title: $('#title').val(),
                Season: $('#season').val(),
                Author: $('#author').val(),
                MagazineDate: $('#magazineDate').val(),
                MagazineVolume: $('#magazineVolume').val(),
                MagazineNumber: $('#magazineNumber').val(),
                MagazinePageNumbers: $('#magazinePageNumbers').val(),
                //Identifiers
                Isbn: $('#isbn').val(),
                Upc: $('#upc').val(),
                Issn: $('#issn').val(),
                OclcNumber: $('#oclcNumber').val(),

                //supplementalDetails
                //Abridged: $('#abridged').val(), // radio
                Abridged: $("input[name=abridged]:checked").val(),
               
                Publisher: $('#publisher').val(),
                PublicationYear: $('#publicationYear').val(),

                //access
                // ShouldPlaceHoldWhenAvailable: $("input[name=placeHoldWhenAvailable]:checked").val(),
               // ShouldPlaceHoldWhenAvailable: Boolean($("input[name=placeHoldWhenAvailable]:checked").val()),
                PlaceHoldWhenAvailable: $("input[name=placeHoldWhenAvailable]:checked").val(),
                HoldPickupLocationId: $("#pickupLocation").val(),
                IllItem: illVal,
                // IllItem: $("#illItem").is("checked")
                //bookmobileStop  NOT
                //upc used to pass in barcode to get vufind id
                BookMobileStop:$('#reg_CardNumberForm').val(),
                Comments: $('#comments').val() + "BARCODE " + $('#reg_CardNumberForm').val()
                // CreatedByID: "101268",
            }
    return pData;
}

function PostMaterialRequest(pData) {

   
    var url = uriRoot + "api/MaterialRequestsAPI"
   // var url = "http://localhost:26226/api/MaterialRequestsAPI"
    console.log("pdata:", pData);
    var sData = JSON.stringify(pData);
    console.log("sdata:", sData);
    $.ajax({
        url: url,
        crossDomain: true,
        processData: false,
        type: 'post',
        contentType: "application/json",
        data: sData,
      
        error: function (data) {
            if (console && console.log) {
                console.log("Sample of data:", data);
                 
            }
			if	(data.indexOf("outside the bounds") >=0)
			{
				data = data + "\n" + "Check user name in Horizon, requires comma between last and first";
			}
			PostErrorSwal(data);
        },
        success: function (data, status) {
            console.log("Sample of data:", data['Id']);

            var tempEmail = $('#email').val();
            var tempHomeLocation = $('#pickupLocation').val();
            document.getElementById("materialsRequestForm").reset();
            $('#email').val(tempEmail);
            $('#pickupLocation').val(tempHomeLocation);
            $("#statusSelect").val("100").change();
            $('#showRequestli').click();
           
        }

    });
}
function setFieldVisibility() {
    $(".formatSpecificField").hide();
   
    //Get the selected format 
    var selectedFormat = $("#format option:selected").val();
    $("." + selectedFormat + "Field").show();

    //Update labels as neded 
    if (selectedFormat == 'dvd' || selectedFormat == 'vhs') {
        $("#authorFieldLabel").html("Actor / Director <span class='requiredIndicator'>*</span>:");
    } else if (selectedFormat == 'cdMusic') {
        $("#authorFieldLabel").html("Artist / Composer <span class='requiredIndicator'>*</span>:");
    } else {
        $("#authorFieldLabel").html("Author <span class='requiredIndicator'>*</span>:");
    }

    if (selectedFormat == 'article') {
        $("#magazineTitle").addClass('required');
        $("#magazineDate").addClass('required');
        $("#magazineVolume").addClass('required');
        $("#magazineNumber").addClass('required');
        $("#magazinePageNumbers").addClass('required');
        // $("#acceptCopyrightYes").addClass('required');
        $("#supplementalDetailsLegend").hide();
        $("#identifiersLegend").show();
        $("#supplementalDetails").hide();
        $("#copyright").show();
        $("#titleLabel").html("Article Title <span class='requiredIndicator'>*</span>:");
    } else {
        $("#magazineTitle").removeClass('required');
        $("#magazineDate").removeClass('required');
        $("#magazineVolume").removeClass('required');
        $("#magazineNumber").removeClass('required');
        $("#magazinePageNumbers").removeClass('required');
        $("#acceptCopyrightYes").removeClass('required');
        $("#identifiersLegend").show();
        $("#supplementalDetailsLegend").show();
        $("#supplementalDetails").show();
        $("#copyright").hide();
        $("#titleLabel").html("Title <span class='requiredIndicator'>*</span>:");
    }
}

function updateHoldOptions() {
    var placeHold = $("input[name=placeHoldWhenAvailable]:checked").val();
    if (placeHold == 1) {
        $("#pickupLocationField").show();
    } else {
        $("#pickupLocationField").hide();
    }
}


function loadTabWindow(tab, url) {
    // hideFormViews();:

    var mywin = window.open(url, '_blank', 'location=0,height=820,width=780,scrollbars=yes,status=no,menubar=0');
    (mywin.onload = function () { mywin.document.title = 'New Page Title!'; })();
    mywin.document.title = '';
    console.log("got a load loadTabWindow click tab - url ", tab, " ", url);

}
function CheckIdTest() {
    console.log("CheckID  isAuthorized l ", isAuthorized);
    isAuthorized = true;
    $("#registrationForm").validate({});
}
function CheckId() {
   // $('#reg_CardNumberForm').css("background-color", 'white')
    //var inpObj = document.getElementById("reg_CardNumberForm");
    var id = $('#reg_CardNumberForm').val();
    var pin = $('#reg_CardPinForm').val();
    CheckSip(id, pin);
  
}
function CheckAuthSIP(id,pin){
    //var url = path + "/AJ/AX/JSON?method=loginUser"
  
    var url  = uriRoot +  "api/SIP/";
    $.ajax({
    url: url,
    data: { id: id, pin: pin},
    success: function (response) {
    if (response.result.success == true) {
        isAuthorized = true;
    } else {
        alert("That login was not recognized.  Please try again.");
        return false;
    }
},
error: function (jqXHR, textStatus, errorThrown) {
    alert("That login was not recognized.  Please try again.");
    return false;
},
dataType: 'json'
   // type: 'post'
});
return false;
}
function CheckSip(id, pin) {

    var uri = uriRoot + "api/SIP/" ;
   // var uri = uriRoot + "api/SIP/" + id;
    if (showDebug == true) {
       // console.log(" check siop p3 time ", jQuery('#reg_res_datetime').val());
        console.log("uri is" + uri)
    }


    var temp_id = false;
    if (id.indexOf('-') > -1) {
        temp_id = true;
    }

    //console.log("reg id is" + $('#reg_res_id').val())

    var promise =
        $.ajax({
            url: uri,
            data: { id: id, pin: pin },
           // crossDomain: true,
          //  processData: false,
            type: 'GET',
            contentType: "application/json"

        });
    

    promise.done(function (data, status) {
        // setReservation(JSON.stringify(data));
        // PutReservation(reservationDTO);
        var jdata = JSON.stringify(data);
        var jsonData = JSON.parse(jdata);
        // var jsonData = JSON.parse(data);
        // tempMessage = "#You do not have approved status - please refer to the circulation desk"
        var tempMessage = "#You do not have approved status";
        var auth = jsonData['Authorized'];
        var email = jsonData['Email'];
        var homeLocation = jsonData['Location'];
        $("#email").val(email);
        setHomeLocation(homeLocation);
        var message = jsonData['Message'];
        if (message != null && message.indexOf(tempMessage) > -1) {
            auth = true;
            if (showDebug == true) {
                console.log("matched the message: ", message);
            }
        }
        console.log("auth data ", auth);
        if (auth == true) {
            isAuthorized = true;
            if (showDebug == true) {
                console.log("put data ", jsonData);
                console.log("jdata ", jdata);
            }
            afterSuccessfulLogin();
            //  SendMail(jsonData);
            //var ret = DoReservedSwal(jdata);
        }
        else {
            swal("Problem Authorizing Library Card", "Please see library admin", "error");
        }
    });
    promise.fail(function (data, status) {
        swal("Problem With Request", data.responseText, "error");
    });
}
function getWeekRequestCount() {
    var barcode = $.trim($('#reg_CardNumberForm').val());
    var requestCount = 0;
    console.log("barcode ", barcode);

    $.getJSON(uriRoot + 'api/MaterialRequestsAPI/WeekRequests/' + barcode)
          .done(function (data) {
              if (data > 6) {
                  console.log("requestCount ", data);
                  swal("Maximum weekly requests exceeded", "", "error");
                  $('#showRequestli').click();
                  return;
              }
              else {
                  console.log("should post here ", data)
                  PostMaterialRequest(BuildMaterialRequestData());
              }
          })
          .fail(function (jqXHR, textStatus, err) {
              swal("Problem Processing Submit", "", "error");
          });


}
function getRequests() {
    var barcode = $.trim($('#reg_CardNumberForm').val());
    console.log("barcode ", barcode);
    //api/MaterialRequestsAPI/list/23025006115711
    $.getJSON(uriRoot + 'api/MaterialRequestsAPI/list/'+  barcode)
          .done(function (data) {
             // console.log("searchData ", data)

              $('#requestListDiv').html(formatRequestItem(data, barcode));
              //$('#divResultUp').html(formatItemUpComing(data));
          })
          .fail(function (jqXHR, textStatus, err) {
              // $('#divResult').html('Error: ' + err);
          });
}

function getFilteredRequests() {
    var barcode = $.trim($('#reg_CardNumberForm').val());
    var status = $('#statusSelect option:selected').val();
    console.log("barcode ", barcode);
    //api/MaterialRequestsAPI/list/23025006115711
    $.getJSON(uriRoot + 'api/MaterialRequestsAPI/list/' + barcode +'/' + status )
          .done(function (data) {
              // console.log("searchData ", data)

              $('#requestListDiv').html(formatRequestItem(data, barcode));
              //$('#divResultUp').html(formatItemUpComing(data));
          })
          .fail(function (jqXHR, textStatus, err) {
              // $('#divResult').html('Error: ' + err);
          });
}
function setHomeLocation(stringHomeLocation)
{
    //stringHomeLocation = "pa";

    switch (stringHomeLocation) {
        case "pa":
            intHomeLocation = 1;
            break;
        case "cap": //cap
            intHomeLocation = 2;
            break;
        case "cr":
            intHomeLocation = 3;
            break;
        case "hi":
            intHomeLocation = 4;
            break;
        case "lou":  //lou
            intHomeLocation = 5;
            break;
        case "lt":
            intHomeLocation = 6;
            break;
        case "rox":  //rox
            intHomeLocation = 7;
            break;
        default:
            intHomeLocation = 2;

    }
    $("#pickupLocation").val(intHomeLocation);
    
      

}
function formatRequestItem(data, barcode) {
    var result = "";
    var status = $('#statusSelect option:selected').val();
    // var barcodeLine = '<h5> Results for barcode:  ' + lastBarcode + '</h5> <br/>';
    // var result = barcodeLine;
   // var emptyData = 'No ' + status + ' material requests were found for: "' + barcode + '"';
	var emptyData = 'No material requests for this status were found for: "' + barcode + '"';
    var emptyResults = '<font color="red" >' + '<strong>' + emptyData + '</strong>' + '</font><br/><br/>';
    // var emptyResults = barcodeLine + '<font color="red" >' + '<strong>' + emptyData + '</strong>' + '</font><br/><br/>';
    var foundData = false;
    if (data.length) {
       // result += '<h4>' + 'My Requests: ' + '</h4>';
        result += '<div class="table-responsive">';
        result += '<table class="table" border="0" id="todayTable">';
        result += '<tr>';
        result += '<th>Title</th>';
        result += '<th>Author</th>';
        result += '<th>Format</th>';
        result += '<th>Status</th>';
        result += '<th>Created</th>';
        result += '<th></th>';
        result += '</tr>';

        $.each(data, function (i, item) {
            var btnSubmit = "rowsubmit" + item.Id;
            // if (CompareDateDayFunction(new Date(), item.ReservationStartDateTime)) {
            if (true) {
                foundData = true;
                // result += '<tr  id="' + btnSubmit + '" >';
                result += '<td>' + item.Title + '</td>';
                result += '<td>' + item.Author + '</td>';
                result += '<td>' + item.Format + '</td>';
                result += '<td>' + item.Status + '</td>';
                result += '<td>' + ConvertToDateFunction(item.Created) + '</td>';
                if (item.Status == "Request Pending") {

                    result += '<td>' + '<button id="' + btnSubmit + '" class="btn btn-primary pull-right" onclick="' + 'CancelReservation(' + item.Id + ', true );">Cancel</button >' + '</td>';
                }
                else {
                    result += '<td>' + '<button id="' + btnSubmit + '" class="btn btn-primary pull-right disabled""> Cancel</button >' + '</td>';
                }
                //  result += '<td>' + '<button type="button" id="' + btnSubmit + '" class="btn btn-default pull-right" onclick="' + 'CancelReservation(' + item.Id + ', true );">Cancel</button >' + '</td>';
                result += '</tr>';
            }
        });

        result += '</table>';
        result += '</div>';
        return result;
    }
    else {
        return emptyResults;
    }
}
function ConvertToDateFunction(nuDate) {
    return nuDate.substring(0, 10);
}

function ConvertToTimeFunction(nuDate) {
    return nuDate.substring(11, 16);
}
function toggleLoginReminder()
{
    if (isAuthorized == false) {
        $('#loginReminder').css("font-size", "180%");
        jQuery('#loginReminder').fadeToggle();
        jQuery('#loginReminder').fadeToggle();
        $('#loginReminder').css("font-weight", "Bold");
        $('#loginReminder').css("font-size", "100%");
    }
}
function PostErrorSwal(data) {
    
    var jdata = JSON.stringify(data);
    var pjdata = JSON.parse(jdata);
    console.log(pjdata);
    console.log(pjdata['responseText']);
    swal("Problem with entry data",pjdata['responseText'], "error" 
);
}

