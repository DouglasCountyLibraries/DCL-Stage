(function() {
  $(function() {
    var $demo, duration, remaining, tour;
    $demo = $("#demo");
    duration = 5000;
    remaining = duration;
var tour = new Tour({
  debug: true,
  storage: false,
  steps: [
  {
	path:"/",
    element: "#step1",
    content: "Need a library card?",
    placement: "bottom",
	backdrop: true,
  },
  {
	path:"/",
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
	path:"/",
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
	path:"/",
    element: "#step4",
    content: "Create your account to start placing holds, renew checkouts, and more!",
    placement: "bottom",
	backdrop: true,
  },
	{
	path:"/",
    element: "#step5",
    content: "It's easy! Use your full 14-digit barcode to start. Then create a username for easy access later. Hint: Your PIN is most likely the last four digits of your phone number.",
    placement: "right",
	backdrop: true,
    onShow: function() {
      return $("#step4").addClass("open");
    },      
    onHide: function() {
      $("#step4").removeClass("open"); 
    } 
  }
	  
]}).init();
    if (tour.ended()) {
      $('<div class="alert alert-info alert-dismissable"><button class="close" data-dismiss="alert" aria-hidden="true">×</button>You ended the demo tour. <a href="#" data-demo>Restart the demo tour.</a></div>').prependTo(".content").alert();
    }
    $(document).on("click", "[data-demo]", function(e) {
      e.preventDefault();
      if ($(this).hasClass("disabled")) {
        return;
      }
      tour.restart();
      return $(".alert").alert("close");
    });
    $("html").smoothScroll();
    return $(".gravatar").each(function() {
      var $this, email;
      $this = $(this);
      email = md5($this.data("email"));
      return $(this).attr("src", "http://www.gravatar.com/avatar/" + email + "?s=60");
    });
  });

}).call(this);
