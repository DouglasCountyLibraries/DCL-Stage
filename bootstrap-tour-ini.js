(function() {
  $(function() {
    var $demo, duration, remaining, tour;
    $demo = $("#demo");
    duration = 5000;
    remaining = duration;
    tour = new Tour({
      onStart: function() {
        return $demo.addClass("disabled", true);
      },
      onEnd: function() {
        return $demo.removeClass("disabled", true);
      },
      debug: true,
  steps: [
  {
    element: "#appSettings",
    content: "Need a library card?",
    placement: "bottom",
	backdrop: true,
  },
  {
    element: "#step2",
    content: "Sign up here! You won't regret it.",
    placement: "right",
	backdrop: true,
    onShow: function() {
      return $("#appSettings").addClass("open");
    },      
    onHide: function() {
      $("#appSettings").removeClass("open"); 
    } 
  } ,
   {
    element: "#step3",
    content: "Stream and download digital movies, TV, music, magazines, e-books and audiobooks from this page.",
    placement: "bottom",
	backdrop: true,
  }, 
    {
    element: "#step4",
    content: "Got a new device? Need a digital assist? We're here for you!",
    placement: "top",
	backdrop: true,
	path: "http://stage.dcl.org/digital-media/"
  },   
   {
    element: "#appSettings2",
    content: "Looking for new books and movies?",
    placement: "bottom",
	backdrop: true,
  },
  {
    element: "#test3",
    content: "Click New Titles to discover what's "Just Arrived" and what's "On Order."",
    placement: "right",
	backdrop: true,
    onShow: function() {
      return $("#appSettings2").addClass("open");
    },      
    onHide: function() {
      $("#appSettings2").removeClass("open"); 
    } 
  } ,  
    {
    element: "#step5",
    content: "You must register before using the new catalog, using your full 14-digit barcode. After that, you can create a user name for easy access on future visits! Your PIN is most likely the last four digits of your phone number. Happy searching! We hope you discover a great new read!",
    placement: "bottom",
	backdrop: true,
  },  {
          path: "/api",
          title: "And support for orphan steps",
          content: "If you activate the orphan property, the step(s) are shown centered in the page, and you can\nforget to specify element and placement!",
          orphan: true,
          onHidden: function() {
            return window.location.assign("/");
          }
        }
      ]
    }).init();
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