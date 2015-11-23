(function ($){
	// Hantera svaret från servern
	function showResponse(data, statusText, xhr, $form)  {
		var feedbackPanel = $('.illAcq ul.feedbackPanel'),
			form = $('.illAcq form');
			
		//console.debug(feedbackPanel);
			
		if ( data.success === true ) {
			//console.debug("success");
			feedbackPanel.html('<li class="feedbackPanelINFO"><span class="fa fa-info"></span> <span class="feedbackPanelINFO">'+data.message+'</span></li>');
			form.hide();
		}
		else {
			//console.debug("error");
			feedbackPanel.html('<li class="feedbackPanelERROR"><span class="fa fa-warning"></span> <span class="feedbackPanelERROR">'+data.message+'</span></li>');
		}
		feedbackPanel.show();
	}
	
	// Initialisera formuläret
	function init() {
		// Sätt lånekortsnummer
		var card = $('div.arena-external-link > a').attr('href');
		$('input[name=card]').attr('value',card);
				
		if ( card && card !== "1234" ) {
			$(".illAcq form").show();
			$(".illAcq .feedbackPanelERROR").hide();
		}
				
		// Kolla stöd för Local Storage
		if(typeof(Storage) !== "undefined") {
				
			// Hämta lagrade värden (sätts i samband med submit)
			if ( sessionStorage.name ) {
				$('#name').val(sessionStorage.getItem("name"));
			}
			if ( sessionStorage.email ) {
				$('#email').val(sessionStorage.getItem("email"));
			}					
					
			// Rensa vid utlogg
			//console.debug(card);
			if ( typeof(card) === "undefined" ) {
				delete sessionStorage.name;
				delete sessionStorage.email;
			}
		} else {
			console.log("Sorry! No Web Storage support..");
		}	
	}
	
	// Main
	var urlValidationPlugin = '//ajax.aspnetcdn.com/ajax/jquery.validate/1.13.0/jquery.validate.min.js';
	$.cachedScript(urlValidationPlugin).done(function (script, textStatus) {
	
		var urlFormPlugin = '//oss.maxcdn.com/jquery.form/3.50/jquery.form.min.js';
		$.cachedScript(urlFormPlugin).done(function (script, textStatus) {

			var validation = {};
 
			validation =	{
				setupFormValidation: function() {
					$(".illAcq form").validate({
						rules: {
							name: "required",
							email: {
								required: true,
								email: true
							},
							title: "required",
							fee: "required"
						},
						messages: {
							name: "Du glömde skriva in ditt namn",
							email: "Du måste ange en e-postadress vi kan nå dig på",
							title: "Titel måste anges",
							fee: "Du måste acceptera avgiften"
						},
						submitHandler: function(form) {
							// Sätt sessionStorage
							if(typeof(Storage) !== "undefined") {
								sessionStorage.setItem("name", $('#name').val());
								sessionStorage.setItem("email", $('#email').val());
							}
							if ( $('html.ie8, html.ie9').length === 0 ) {
						
								// Förbered formuläret
								var options = { 
									success:       showResponse,  // post-submit callback 
									url:       'https://jnylin.name/bibl/arena/send_wish.php' /*'http://arena.itsam.se/send_wish.php'*/         // override for form's 'action' attribute 
								};
								
								// Skicka det
								$(form).ajaxSubmit(options);
								$('.illAcq form').slideUp();
								$('.illAcq .clear').slideDown();
							}						
							else {
								// IE och CORS är ingen rolig kombination, skicka på vanligt sätt
								// och lägg resultatet i en iframe
								$('iframe[name="outputForIE"]').slideDown();
								form.submit();
								$('.illAcq form').slideUp();								
							}
						}
					});
				}
			};			
		
			$(function() {
				init();
			
				// Sätt valideringsregler
				validation.setupFormValidation();
				
				$('.clear').click(function() {
					var form = $('.illAcq form'),
						feedbackPanel = $('.illAcq ul.feedbackPanel');
					form.trigger('reset');
					$('.illAcq .clear').hide();
					feedbackPanel.hide();
					form.slideDown();
					init();
				});
				
				
			});			

		}).fail(function (jqxhr, settings, exception) {
			console.log("Failed loading script: " + urlFormPlugin);
		});
	
	}).fail(function (jqxhr, settings, exception) {
		console.log("Failed loading script: " + urlValidationPlugin);
	});
		
})(jQuery);
