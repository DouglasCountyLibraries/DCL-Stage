
function CancelReservation(id, showSwal) {
    VerifyCancel(id, true, 40, Cancel);
}
function Cancel(id, showSwal, cancelStatus) {
    var uri = uriRoot + "api/MaterialRequestsAPI/" + id;
    if (showDebug == true) {
        console.log(" p3 time ", jQuery('#reg_res_datetime').val());
        console.log("uri is" + uri)
        console.log("reg id is" + $('#reg_res_id').val())
    }

    var elementid = "rowsubmit" + id;
    $.ajax({
        url: uri,
        crossDomain: true,
        processData: false,
        type: 'delete',
        contentType: "application/json",

        error: function (data) {
            if (console && console.log) {
                console.log("Sample of data:", data);
            }
        },
        success: function (data, status) {

            if (showSwal) {
                CancelSuccessSwal(data);
            }
            
      

            $("#statusSelect").val("19").change();
           // $('#statusSelect option[value=19]').attr('selected', 'selected');
            var status = $('#statusSelect option:selected').val();
          //  $('statusSelect  option[value="19').prop("selected", true);
           // status = $('#statusSelect option:selected').val();
           // getFilteredRequests();
        }
    });

}
function CancelSuccessSwal(data) {

    var jdata = JSON.stringify(data);
    var pjdata = JSON.parse(jdata);
    console.log("pjdata" + pjdata);
    // console.log("response" + pjdata['responseJSON']);
    swal({
        title: 'Request Cancelled',
        allowOutsideClick: true,
        type: "success",
        showCancelButton: false,
        //confirmButtonColor: "#DD6B55",  
        confirmButtonText: "OK!",

        closeOnConfirm: true //}, 

    });



}
function VerifyCancel(id, showSwal, status, callback) {
    swal({
        title: 'You are requesting to cancel',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: "Yes, Please Cancel !",
        cancelButtonText: "No, Save my Request!",
        closeOnCancel: true,
        closeOnConfirm: true //}, 
    },
    function (isConfirm) {
        if (isConfirm) {
            // func(id, true, status)
            // func(id, showSwal, status);
            //callback(1, true, 90);
            func = new Function(callback(id, showSwal, status));
            func();
        }
        else {
            setTimeout(function () { swal("Your request is preserved") }, 100);

        }
    });

}
