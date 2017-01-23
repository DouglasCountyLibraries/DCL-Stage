$(function () {
    tour = new Tour({
      onStart: function() {
        return $demo.addClass("disabled", true);
      },
      onEnd: function() {
        return $demo.removeClass("disabled", true);
      },
  debug: true,
  storage: false,
  steps: [
  {
    element: "#step1",
    content: "Need a library card?",
    placement: "bottom",
	backdrop: true,
  },
  {
    element: "#step2",
    content: "Get it here, then use it like crazy!",
    placement: "right",
	backdrop: true,
    onShow: function() {
      return $("#step1").addClass("open");
    },      
    onHide: function() {
      $("#step1").removeClass("open"); 
    } 
  } ,
   {
    element: "#step3",
    content: "Stream and download digital movies, TV, music, magazines, e-books and audiobooks from this page.",
    placement: "bottom",
	backdrop: true,
  }, 
    {
	path: "../digital-media",
    element: "#help",
    content: "Got a new device? Need a digital assist? We're here for you!",
    placement: "top",
	backdrop: true,
  },   
   {
	path: "../digital-media",
    element: "#step4",
    content: "Create your account to start placing holds, renew checkouts, and more!",
    placement: "bottom",
	backdrop: true,
  }
]});

tour.init();
tour.restart();

$(document).on('click', '.popover-navigation [data-role=next],.popover-navigation [data-role=prev]', function (e) {
        e.stopPropagation();
    });
  });