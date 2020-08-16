<script>
$("body").on("click",".closeCookies",function(){
	setCookie("aceptado",1,365);
	$(".closeCookiesBox").addClass("animated fadeOut");
});
</script>