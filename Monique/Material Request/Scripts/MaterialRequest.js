
var isAuthorized = false;
var activeTab = null;

$(document).ready(function () {
    console.log("(document).ready");
    activeTab = "registrationTab";
    // $("#materialsRequestForm").validator();
    showLogin();
    $.validator.addMethod("copyrightCheck", function (value, element) {
        handleCopyright();
    }, 'Password and Confirm Password should be same');
    // $("#materialsRequest").hide();
    var $tabs = $('#tabs').tabs();
    $("a.tabref").click(function () {
        //event code
        console.log("got a tabref click");
        loadTabWindow($(this).attr("href"), $(this).attr("rel"));

    });
  
    $('[href=#registrationTab]').on('shown.bs.tab', function (e) {
        console.log("href=#registrationTab isAuth: ", isAuthorized);
        activeTab = "registrationTab";
        console.log("activeTab ", activeTab);
        if (isAuthorized == true) {
            console.log("href=#registrationTab");
            showMaterialRequest();
        }
        else {
            showLogin();
        }
    });
    $('[href=#showRequests]').on('shown.bs.tab', function (e) {
        console.log("href=#requestListDiv isAuth: ", isAuthorized);
        activeTab = "showRequests";
        console.log("activeTab ", activeTab);
        if (isAuthorized == true) {
            console.log("href=#requestListDiv");
            showRequestList();
        }
        else {
            showLogin();
        }
    });
    $("#materialsRequestForm").validate({
        submitHandler: function () {
            // do other things for a valid form
            PostMaterialRequest(BuildMaterialRequestData());
        },
        wrapper: 'span',
        rules:{
            'acceptCopyright': {
                required: true,
                equalTo: "#acceptCopyrightYes"
            }
        },
        messages: {
            'acceptCopyright': {
                required: 'Agreement must be accepted.',
                equalTo: 'Agreement must be accepted.'
            }
        },
        errorPlacement: function (error, element) {
            error.css({ 'padding-left': '10px', 'margin-right': '20px', 'padding-bottom': '2px' });
            error.addClass("arrow")
            error.insertAfter(element);
        }
    });
    // $('#materialRequestForm').ajaxForm();
    //$('#materialRequestForm').submit(function () {
    //    // submit the form 
    //    $(this).ajaxSubmit(); 
    //    // return false to prevent normal browser submit and page navigation 
    //    return false; 
    //});
    //$('#getMaterialRequests').click(function () {
    //    alert('getMaterialRequests is clicked, do something');
    //});
    $('#accessMaterialAccess').click(function () {
        console.log("accessMaterialAccess access click");
        $("#materialsRequest").show();
        $("#registerDiv").hide();
        $("#requestListDiv").hide();

        // isAuthorized = true;


    })
    //});
    $('#mrLogin').click(function () {
        console.log(" mrLoginaccess click");
        isAuthorized = true;
        if (activeTab == "registrationTab") {
            showMaterialRequest();

        }
        else {
            showRequestList();
        }
       

        // isAuthorized = true;


    })
    //$(".materialRequestForm").validate({
    //    submitHandler: function ($(".materialRequestForm")) {
    //        // do other things for a valid form
    //        $(".materialRequestForm").submit();
    //    }
    //});
});
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

        submitHandler: function () {
           
            // do other things for a valid form
            PostMaterialRequest(BuildMaterialRequestData());
           
        },
        errorPlacement: function (error, element) {
            error.css({ 'padding-left': '10px', 'margin-right': '20px', 'padding-bottom': '2px' });
            error.addClass("arrow")
            error.insertAfter(element);
        },
        wrapper: 'span'
    });
    //$(".materialRequestForm").validate({
    //    submitHandler: function (form) {
    //        $(form).PostMaterialRequest(BuildMaterialRequestData());;
    //    }
    //});



    // return;
    //PostMaterialRequest(BuildMaterialRequestData());



}
function BuildMaterialRequestData() {

    var holdnumber = $("#pickupLocation").val();
    console.log("hold pickup ", holdnumber);
    //if ($('#magazineTitle').val().length > 0) {
    //    $('#title').val($('#magazineTitle').val());
    //}
    var pData =
            {
                //  UserId: $('#reg_CardNumberForm').val(),
                UserId: $('#reg_CardNumberForm').val(),

                //  Email: $('#email').val(),
                Email: "j@j.com",
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
                ShouldPlaceHoldWhenAvailable:Boolean($("input[name=placeHoldWhenAvailable]:checked").val()),
                HoldPickupLocationId: $("#pickupLocation").val(),
                IllItem: $("input[name=illItem]:checked").val(),
                // IllItem: $("#illItem").is("checked")
                //bookmobileStop  NOT
                About: $('#about').val(),
               // Title: $('#acceptCopyrightNo').val(),
                //upc used to pass in barcode to get vufind id
                Comments: $('#comments').val() + "BARCODE 23025007036700"
                // CreatedByID: "101268",
            }
    return pData;
}

function PostMaterialRequest(pData) {

    /* var pData =
        {

            Branch: $('#mr_title').val(),
            IsOverride: "false",
            ReservationStartDateTime: jQuery('#reg_res_datetime').val(),
            ReservationLength: $('#reg_res_slength').val(),
            UserId: $('#reg_CardNumberForm').val(),
            RoomName: $('#reg_computer').val()
        } */
    // setReservation(JSON.stringify(pData));
    // console.log(" post reservation time ", jQuery('#reg_res_datetime').val());
    // console.log(" postresDTO ", reservationDTO);
    // var tjdata = JSON.stringify(pData);
    // console.log("tjdata " + tjdata);
    var uri = "http://localhost:26226/api/MaterialRequestsAPI"
    // var uri = urlRoot + "/api/SRReservations/Pre"
    var sData = JSON.stringify(pData);
    console.log("sdata:", sData);
    $.ajax({
        url: uri,
        crossDomain: true,
        processData: false,
        type: 'post',
        contentType: "application/json",
        data: sData,
        // data: JSON.stringify(pData),
        /*  headers: {
             X-Requested-With: 'Header Value One',   //If your header name has spaces or any other char not appropriate
            // "Header Name Two": 'Header Value Two'  //for object property name, use quoted notation shown in second
         }, */
        //  dataType: 'json',
        error: function (data) {
            if (console && console.log) {
                console.log("Sample of data:", data);
                // PostErrorSwal(data);
            }
        },
        success: function (data, status) {
            console.log("Sample of data:", data['Id']);

            // $('#from_reserve_id').val(data['Id']);
            //  console.log("fromReserveId", $('#from_reserve_id').val());
            //from_reserve_id

            // showFormView();
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
        $("#supplementalDetails").show();
        $("#copyright").hide();
        $("#titleLabel").html("Title <span class='requiredIndicator'>*</span>:");
    }
}

function updateHoldOptions() {
    var placeHold = $("input[name=placeHoldWhenAvailable]:checked").val();
    if (placeHold == 1) {
        $("#pickupLocationField").show();
        if ($("#pickupLocation option:selected").val() == 'bookmobile') {
            $("#bookmobileStopField").show();
        } else {
            $("#bookmobileStopField").hide();
        }
    } else {
        $("#bookmobileStopField").hide();
        $("#pickupLocationField").hide();
    }
}

function materialsRequestLogin() {
    var url = path + "/AJAX/JSON?method=loginUser"
    $.ajax({
        url: url,
        data: { username: $('#username').val(), password: $('#password').val() },
        success: function (response) {
            if (response.result.success == true) {
                //Update the main display to show the user is logged in
                // Hide "log in" options and show "log out" options:
                $('.loginOptions').hide();
                $('.logoutOptions').show();
                $('#myAccountNameLink').html(response.result.name);
                if (response.result.enableMaterialsRequest) {
                    document.location = '/MaterialsRequest/NewRequest';
                } else {
                    alert("Sorry, materials request functionality is only available to residents at this time.");
                }
            } else {
                alert("That login was not recognized.  Please try again.");
                return false;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("That login was not recognized.  Please try again.");
            return false;
        },
        dataType: 'json',
        type: 'post'
    });
    return false;
}
function loadTabWindow(tab, url) {
    // hideFormViews();:

    var mywin = window.open(url, '_blank', 'location=0,height=820,width=780,scrollbars=yes,status=no,menubar=0');
    (mywin.onload = function () { mywin.document.title = 'New Page Title!'; })();
    mywin.document.title = '';
    console.log("got a load loadTabWindow click tab - url ", tab, " ", url);

}
function CheckId() {
    console.log("CheckID  isAuthorized l ", isAuthorized);
    isAuthorized = true;
}
function CheckIdReal() {
    $('#reg_CardNumberForm').css("background-color", 'white')
    var inpObj = document.getElementById("reg_CardNumberForm");
    var id = $('#reg_CardNumberForm').val();
    var isAuthorized = false;
    var valData = ValidateBarcode(id);
    $('#reg_CardNumberForm').val(valData.bid);
    console.log("isValid ", valData.isValid, " id ", valData.bid);
    //if (
    //  id.match(/(2302500)\d{7}/) || id.match(new RegExp('^\\d{7}$')) || id.match(/(230250)\d{6}-\d{1}/)) {
    //    if (id.length == 7) { id = '2302500' + id; }
    if (valData.isValid) {
        //CheckSip(id);
        CheckSip(valData.bid);
        return false;
    }


    else {
        swal("Enter a valid card number", '', 'error');
        $('#reg_CardNumberForm').val("");
        $('#reg_CardNumberForm').css("background-color", '#FFB38A')
        return false;
    }
}
function CheckSip(id) {

    var uri = urlRoot + "api/SIP/" + id;
    if (showDebug == true) {
        console.log(" check siop p3 time ", jQuery('#reg_res_datetime').val());
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
            crossDomain: true,
            processData: false,
            type: 'GET',
            contentType: "application/json"

        });
    //promise.fail(function (data, status) {
    //    swal("Problem Authorizing Library Card", status, "error");
    //});

    promise.done(function (data, status) {
        // setReservation(JSON.stringify(data));
        // PutReservation(reservationDTO);
        var jdata = JSON.stringify(data);
        var jsonData = JSON.parse(jdata);
        // var jsonData = JSON.parse(data);
        // tempMessage = "#You do not have approved status - please refer to the circulation desk"
        var tempMessage = "#You do not have approved status";
        var auth = jsonData['Authorized'];
        var message = jsonData['Message'];
        if (message != null && message.indexOf(tempMessage) > -1) {
            auth = true;
            if (showDebug == true) {
                console.log("matched the message: ", message);
            }
        }
        console.log("auth data ", auth);
        if (auth == true) {
            PutReservation(jsonData);
            isReservationConfirmed = true;
            if (showDebug == true) {
                console.log("put data ", jsonData);
                console.log("jdata ", jdata);
            }

            //  SendMail(jsonData);
            var ret = DoReservedSwal(jdata);
        }
        else {
            swal("Problem Authorizing Library Card", "Please see library admin", "error");
        }
    });
    promise.fail(function (data, status) {
        swal("Problem With Request", data.responseText, "error");
    });
}
