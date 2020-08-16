<script>
var lastE = "";
var lastG = 0;
var play_now = "==(play_now_txt)==";
var b = document.documentElement;
var cefList = ["idcTesting","idclauncher","idcplaystv"];
b.setAttribute("data-useragent",  navigator.userAgent);
b.setAttribute("data-platform", navigator.platform );
b.className += ((!!("ontouchstart" in window) || !!("onmsgesturechange" in window))?" touch":"");
</script>
<script>
/****************************************************************************************************************************/
/************************************************  SESION, STORAGE & COOKIES ************************************************/
/****************************************************************************************************************************/
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(";");
	for(var i = 0;i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + "; domain=idcgames.net; path=/; SameSite=Strict; Secure";
}
function setCookieWT(cname, cvalue) {
    var expires = document.cookie.indexOf(cname) === -1
		? new Date(new Date().setTime(new Date().getTime()+30*24*60*60*1000)) // 30 days
		: unescape(document.cookie).split('expireDate=')[1]; // split out date to reuse
	document.cookie = cname + "=" + cvalue + ";" + expires + "; domain=idcgames.net; path=/; SameSite=Strict; Secure";
}
function saveUtm(){
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	if( typeof( vars.utm_source		) 	== "string" ) setCookie("utm_source"	,	vars.utm_source		, 1);
	if( typeof( vars.utm_campaign	) 	== "string" ) setCookie("utm_campaign"	,	vars.utm_campaign	, 1);
	if( typeof( vars.utm_medium		) 	== "string" ) setCookie("utm_medium"	,	vars.utm_medium		, 1);
	if( typeof( vars.utm_term		) 	== "string" ) setCookie("utm_term"		,	vars.utm_term		, 1);
	if( typeof( vars.utm_content	) 	== "string" ) setCookie("utm_content"	,	vars.utm_content	, 1);
	if( typeof( vars.pixelTracking	) 	== "string" ) setCookie("pixelTracking"	,	vars.pixelTracking	, 1);
	if( typeof( vars.pub			) 	== "string" ) setCookie("pub"			,	vars.pub			, 1);
	if( typeof( vars.tid			) 	== "string" ) setCookie("tid"			,	vars.tid			, 1);
}
function saveSession(data){
	if( data.keep == true){
		setCookie("id", data.id, 365);
		setCookie("currency", data.currency, 365);
		setCookie("simbol", data.simbol, 365);
		setCookie("nick", encodeURIComponent(data.nick), 365);
		setCookie("token", data.token, 365);
		localStorage.setItem("games", data.games);
		if( typeof( data.purchased ) != "undefined") localStorage.setItem("games", data.purchased);
	}else{
		document.cookie = "id="+data.id+";domain=idcgames.net";
		document.cookie = "currency="+data.currency+";domain=idcgames.net";
		document.cookie = "simbol="+data.simbol+";domain=idcgames.net";
		document.cookie = "nick="+data.nick+";domain=idcgames.net";
		document.cookie = "token="+data.token+";domain=idcgames.net";
		sessionStorage.setItem("games", data.games);
		if( typeof( data.purchased ) != "undefined") sessionStorage.setItem("games", data.purchased);
	}
}
function loadSession(field){
	if( getCookie(field) != null && getCookie(field) != "" ){
		return getCookie(field);
	}else if( sessionStorage.getItem(field) != null  ){
		return sessionStorage.getItem(field);
	}else if( localStorage.getItem(field) != null  ){
		return localStorage.getItem(field);
	}else{
		return false;
	}
}
function deleteSession(){
	setCookie("id", "", 0);
	setCookie("coins", "", 0);
	setCookie("currency", "", 0);
	setCookie("nick", "", 0);
	setCookie("token", "", 0);
	localStorage.clear();
	sessionStorage.clear();
	$(".logged").hide();
	$(".unlogged").show();
	$(".runLogOff").click();
	notLogged();
}
/****************************************************************************************************************************/
/*************************************************  LOGIN, REGISTER, CHECK  *************************************************/
/****************************************************************************************************************************/
function notLogged(){
	if( loadSession('token') == false){
		if ( isCef() > 0 ){
			(async function() {
				await CefSharp.BindObjectAsync("cefDotNet", "bound");
				cefDotNet.notLogged();
			})();
		}
		console.log("NotLogged");
	}
}
function loginSocial(loginRes){
	console.log("Login Social");
	if (loginRes.rc == 200){
		$(".cUserName").text( loginRes.data.nick );
		$(".cUserNameIcon").attr("title", loginRes.data.nick );
		$(".cCoins").text( loginRes.data.coins );
		$(".logged").show();
		$(".unlogged").hide();
		$(".modal.show").click();
		saveSession(loginRes.data);
		isSuccess = loginRes.data.token;
		$(".runLogIn").click();
		
		if( loginRes.txt == "OK" && isCef() == 0 ){
			window.location.replace('/==(url_thankyou)==');
		}
		if ( isCef() > 0 ){
			try {
				(async function() {
					await CefSharp.BindObjectAsync("cefDotNet", "bound");
					cefDotNet.login( JSON.stringify(loginRes) );
				})(loginRes);
				window.location.replace('/library');
			}catch(err){
				console.log(err);
			}
		}
		notLogged();
	}
}
function loginToken(token,typelog="") {
	var isSuccess;
	isSuccess = false;
	if (isCef() > 0 ) {
		var referer = 'LAUNCHER';
	}else{
		var referer = 'WEB-'+lastG+' ('+document.baseURI+')';;
	}
	if (token != '') {
		$.ajax({
			type:"POST",
			url:"/unilogin/token.php",
			data: 'token='+token+'&game='+lastG+'&cReferer='+referer+'&cFun=loginToken',
			dataType: 'text',
			async:false,
			success: function(json){
				var result = JSON.parse(json);
				if (result.rc == 200){
					$(".cUserName").text( result.data.nick );
					$(".cUserNameIcon").attr("title", result.data.nick );
					$(".cCoins").text( result.data.coins );
					$(".logged").show();
					$(".unlogged").hide();
					$(".modal.show").click();
					saveSession(result.data);
					isSuccess = result.data.token;
					$(".runLogIn").click();
					if( typelog == "NEW+IDC+USER" ){
						if ( isCef() > 0 ){
							window.location.replace('/');
						}else{
							window.location.replace('/==(url_thankyou)==');
						}
					}
				}
				notLogged();
			}
		});
	}
	return isSuccess;
}
function login(user,pass,keep){
	var res = {};
	if (isCef() > 0 ) {
		var referer = 'LAUNCHER';
	}else{
		var referer = 'WEB-'+lastG+' ('+document.baseURI+')';;
	}
	$.ajax({
		type:"POST",
		url:"/unilogin/token.php",
		data: 'cNick='+encodeURIComponent(user)+'&cPassword='+encodeURIComponent(pass)+'&game='+lastG+'&keep='+keep+'&cReferer='+referer+'&cFun=login',
		dataType: 'text',
		async:false,
		error: function(objeto, quepaso, otroobj){
			lastE = quepaso;
			res = {
				"rc": 500,
				"txt": "KO",
				"data": {}
			};
		},
		success: function(json){
			res = JSON.parse(json);
			if (res.rc == 200){
				saveSession(res.data);
			}else{
				setCookie("id", "", 0);
				setCookie("coins", "", 0);
				setCookie("currency", "", 0);
				setCookie("nick", "", 0);
				setCookie("token", "", 0);
				localStorage.clear();
				sessionStorage.clear();
				res = {
					"rc": 404,
					"txt": "KO",
					"data": {}
				};
			}
		}
	});
	return res;
}
function registrar(user,pass,keep){
	/* Pixels */
	!function(f,b,e,v,n,t,s)
		{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
		  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];
	s.parentNode.insertBefore(t,s)}(window, document,'script',
		  'https://connect.facebook.net/en_US/fbevents.js');
	  fbq('init', '373165389547779');
	  fbq('track', 'PageView');
	$("head").append('<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=373165389547779&ev=PageView&noscript=1"/></noscript>');
	!function(_window, _document) {
	var OB_ADV_ID='007fa6d25c29709bd4b3476c0d44ef432b';
	if (_window.obApi) {var toArray = function(object) {return Object.prototype.toString.call(object) === '[object Array]' ? object : [object];};_window.obApi.marketerId = toArray(_window.obApi.marketerId).concat(toArray(OB_ADV_ID));return;}
	var api = window.obApi = function() {api.dispatch ? api.dispatch.apply(api, arguments) : api.queue.push(arguments);};api.version = '1.1';api.loaded = true;api.marketerId = OB_ADV_ID;api.queue = [];var tag = document.createElement('script');tag.async = true;tag.src = '//amplify.outbrain.com/cp/obtp.js';tag.type = 'text/javascript';var script = _document.getElementsByTagName('script')[0];script.parentNode.insertBefore(tag, script);}(window, document);
	obApi('track', 'PAGE_VIEW');
	/* End Pixels */
	var res = {};
	var cLogTrace = "";
	if (isCef() > 0 ) {
		var referer = 'LAUNCHER';
	}else{
		var referer = 'WEB-'+lastG+' ('+document.baseURI+')';
		if ( typeof(platform) == "object" ) {
			var cLogTrace = window.innerWidth+"x"+window.innerHeight+";"+platform.os.family+" "+platform.os.version+" x"+platform.os.architecture+";"+platform.name+":"+platform.version;
		}
	}
	$.ajax({
		type:"POST",
		url:"/unilogin/new_token.php",
		data: 'cNick='+encodeURIComponent(user)+'&cPassword='+encodeURIComponent(pass)+'&game='+lastG+'&keep='+keep+'&game='+lastG +'&cReferer='+referer+'&cFun=registrar&cLogTrace='+cLogTrace,
		dataType: 'text',
		async:false,
		error: function(objeto, quepaso, otroobj){
			lastE = quepaso;
			res = {
				"rc": 500,
				"txt": "KO",
				"data": {}
			};
		},
		success: function(json){
			res = JSON.parse(json);
			if (res.rc == 200){
				saveSession(res.data);
				if ( getCookie("utm_source") == "facebook" ) {
					fbq('track', 'CompleteRegistration');
				}else if ( getCookie("utm_source") == "outbrain" && lastG == 135 ) {
					obApi('track', 'City Battle Event Conversion');
				}
				gtag('event', 'download', {'event_category': 'game', 'event_label': 'adsense', 'value':'1'});
			}else{
				deleteSession();
				res = {
					"rc": res.rc,
					"txt": "KO",
					"data": {}
				};
			}
		}
	});
	return res;
}
/****************************************************************************************************************************/
/*************************************************  GAMES (PLAY, REGISTER)  *************************************************/
/****************************************************************************************************************************/
function registrarGame(game_id){
	var res = {};
	if ( isCef() > 0 ) {
		var referer = 'LAUNCHER';
	}else{
		var referer = 'WEB-'+lastG+' ('+document.baseURI+')';;
	}
	$.ajax({
		type:"POST",
		url:"/unilogin/registro.game.php",
		data: 'token='+loadSession('token')+'&game='+game_id+'&cReferer='+referer+'&cFun=registrarGame',
		dataType: 'text',
		async:true,
		error: function(objeto, quepaso, otroobj){
			lastE = quepaso;
			var res = {
				"rc": 500,
				"txt": "KO",
				"data": {}
			};
			return res;
		},
		success: function(json){
			var result = JSON.parse(json);
			if (result.txt == "OK"){
				loginToken( loadSession("token") );
				if ( getCookie("utm_source") == "facebook" ) {
					fbq('track', 'CompleteRegistration');
				}else if ( getCookie("utm_source") == "outbrain" ) {
					obApi('track', 'City Battle Event Conversion');
				}
				gtag('event', 'download', {'event_category': 'game', 'event_label': 'adsense', 'value':'1'});
			}
			if (result.rc == 200){
				return result;
			}
		}
	});
}
function playGame(game_id){
	lastG = game_id;
	document.cookie = "lastG="+lastG+";domain=idcgames.net";
	if ( isCef() > 0 ){
		try{
			(async function() {
				await CefSharp.BindObjectAsync("cefDotNet", "bound");
				cefDotNet.play(game_id.toString());
			})(game_id);
		}catch(e){
			$.ajax({
				type:"POST",
				url:"/assets/config/"+game_id+".json",
				data: '',
				dataType: 'text',
				async:true,
				success: function(json){
					var result = JSON.parse(json);
					if( typeof(result.game_seo) != "undefined" && result.game_seo != "" ){
						window.location.assign("/"+result.game_seo );
					}
				}
			});
		}
	}else{
		registrarGame(game_id);
		var gameUrl = "/%%(game_seo)%%/";
		if( gameUrl == "//") gameUrl = "/";
		window.location.assign( gameUrl + "==(url_thankyou)==");
	}
}
function isCef(){
	var i = 0;
	$.each( cefList, function( index, value ){
		if( navigator.userAgent.indexOf(value) > 0 ){
			i = index;
		}
	});
	return i;
}
/****************************************************************************************************************************/
/********************************************************  DOWNLOAD  ********************************************************/
/****************************************************************************************************************************/
function getDownload(){
	var id = '';
	if( loadSession('token') != false){
		$.ajax({
			type:"POST",
			url:"/unilogin/launcher.php",
			data: 'token='+loadSession("token"),
			dataType: 'text',
			async:true,
			success: function(json){
				var result = JSON.parse(json);
				if( typeof(result.data) != "undefined"){
					id = result.data;
				}
				$.ajax({
					url: '/launcher/==(launcher_filename)==',
					method: 'GET',
					xhrFields: {
						responseType: 'blob'
					},
					success: function (data) {
						var a = document.createElement('a');
						var url = window.URL.createObjectURL(data);
						a.href = url;
						a.download = 'IDC-Games-launcher-V2'+id+'.exe';
						document.body.append(a);
						a.click();
						a.remove();
						window.URL.revokeObjectURL(url);
					}
				});
			}
		});
	}
}
/****************************************************************************************************************************/
/*********************************************************  SOCIAL  *********************************************************/
/****************************************************************************************************************************/
var socialData = {};
function socialAct(item,target){
	var texto = item.extra;
	target.removeClass("socialAct");
	item.token = loadSession("token");
	item.extra = encodeURIComponent( texto );
	var result = { "data": null, "rc": 500, "txt": "KO"};
	if( item.act=="comment" && item.extra =="" ){
		$(".txtComment").addClass("alert");
		$(".txtComment").addClass("alert-danger");
		setTimeout(function() {
			$(".txtComment").removeClass("alert");
			$(".txtComment").removeClass("alert-danger");
			target.html("==(post_comment)==");
			target.addClass("socialAct");
		},2000);
		return false;
	}
	if( loadSession('token') != false ){
		$.ajax({
			type:"POST",
			url:"/unilogin/action.php",
			data: item,
			dataType: 'text',
			async:true,
			success: function(json){
				result = JSON.parse(json);
				if (result.rc == 200){
					target.html('<i class="fas fa-check-circle"></i>');
					var thisid = item.type+"_"+item.id;
					var last = item.last;
					var votes = {
						"like": $(".like-number[data-id='"+thisid+"']").text()*1,
						"dislike": $(".dislike-number[data-id='"+thisid+"']").text()*1
					};
					if ( last != "" ) {
						votes[last] = votes[last] - 1;
					}
					if ( item.act=="like" ) {
						votes.like++;
					}
					if ( item.act=="dislike" ) {
						votes.dislike++;
					}
					$(".like-number[data-id='"+thisid+"']").text( votes.like );
					$(".dislike-number[data-id='"+thisid+"']").text( votes.dislike );
					target.siblings().removeClass("active");
					target.addClass("active");
					if (  $(".like-number[data-id='"+thisid+"']").text()*1  >= $(".dislike-number[data-id='"+thisid+"']").text()*1 ){
						$(".like-number[data-id='"+thisid+"']").parent(".countVotes").addClass("text-primary");
						$(".like-number[data-id='"+thisid+"']").parent(".countVotes").removeClass("text-secondary");
						$(".dislike-number[data-id='"+thisid+"']").parent(".countVotes").addClass("text-secondary");
						$(".dislike-number[data-id='"+thisid+"']").parent(".countVotes").removeClass("text-primary");
					}else{
						$(".dislike-number[data-id='"+thisid+"']").parent(".countVotes").addClass("text-primary");
						$(".dislike-number[data-id='"+thisid+"']").parent(".countVotes").removeClass("text-secondary");
						$(".like-number[data-id='"+thisid+"']").parent(".countVotes").addClass("text-secondary");
						$(".like-number[data-id='"+thisid+"']").parent(".countVotes").removeClass("text-primary");
					}

					var dt = new Date();
					var dateT = (`${
						dt.getFullYear().toString().padStart(4, '0')}-${
						dt.getDate().toString().padStart(2, '0')}-${
						(dt.getMonth()+1).toString().padStart(2, '0')} ${
						dt.getHours().toString().padStart(2, '0')}:${
						dt.getMinutes().toString().padStart(2, '0')}:${
						dt.getSeconds().toString().padStart(2, '0')}`
					);
					if ( item.act=="like" ){
						var write = '<div class="d-flex flex-row pb-3" data-nick="'+loadSession("nick")+'"><div class="col-auto p-0"><img src="https://cdn.idcgames.net/img/default/bg-artwork-small.jpg" class="img-user" alt="user" title="User profile"></div><div class="col-11"><div><a class="fontSecondarySmall">'+loadSession("nick")+'</a><span class="text-secondary pl-3">'+dateT+'</span></div><p class="">'+texto+'</p><div class="border-bottom border-green-lighter mb-3"><p class="liked text-primary"><i class="fas fa-thumbs-up pr-2"></i>'+loadSession("nick")+' ==(liked_this)==</p></div></div></div>';
					}else{
						var write = '<div class="d-flex flex-row pb-3" data-nick="'+loadSession("nick")+'"><div class="col-auto p-0"><img src="https://cdn.idcgames.net/img/default/bg-artwork-small.jpg" class="img-user" alt="user" title="User profile"></div><div class="col-11"><div><a class="fontSecondarySmall">'+loadSession("nick")+'</a><span class="text-secondary pl-3">'+dateT+'</span></div><p class="">'+texto+'</p><div class="border-bottom border-green-lighter mb-3"><p class="disliked text-secondary"><i class="fas fa-thumbs-down pr-2"></i>'+loadSession("nick")+' ==(disliked_this)==</p></div></div></div>';
					}
					$(".postComments").find("[data-nick='"+loadSession("nick")+"']").remove();
					$(".postComments").append(write);
					localStorage.setItem(item.type+"_"+item.id, JSON.stringify(item) );
					setTimeout(function() {
						target.html("==(post_comment)==");
						target.addClass("socialAct");
					},5000);
					
				}else{
					console.log("ACTION KO");
					target.html('<i class="fas fa-exclamation-triangle"></i>');
					setTimeout(function() {
						target.html("==(post_comment)==");
						target.addClass("socialAct");
					},5000);
				}
				return result;
			},
			error: function(objeto, quepaso, otroobj){
				lastE = quepaso;
				target.html('<i class="fas fa-exclamation-triangle"></i>');
				setTimeout(function() {
					target.html("==(post_comment)==");
					target.addClass("socialAct");
				},5000);
			}

		});

	}else{
		$("[data-target='.loginModal']:first").click();
		$("body").on( "click", ".runLogIn", function() {
			socialAct(item,target);
		});
	}
	return result;
}
var socialData = {};
function getSocialData(json){
	$.ajax({
		type:"POST",
		url:"/unilogin/getSocialData.php",
		data: json,
		dataType: 'text',
		async:true,
		success: function(res){
			if( res != "" ) {
				socialData = JSON.parse(res);
				$.each( socialData, function( index, value ){
					if( typeof(value) == "object" ){
						var likeNum = value.like_count;
						var dislikeNum = value.dislike_count;
						$(".like-number[data-id='"+index+"']").text(likeNum);
						$(".dislike-number[data-id='"+index+"']").text(dislikeNum);
						if (  $(".like-number[data-id='"+index+"']").text()*1  >= $(".dislike-number[data-id='"+index+"']").text()*1 ){
							$(".like-number[data-id='"+index+"']").parent(".countVotes").addClass("text-primary");
							$(".like-number[data-id='"+index+"']").parent(".countVotes").removeClass("text-secondary");
							$(".dislike-number[data-id='"+index+"']").parent(".countVotes").addClass("text-secondary");
							$(".dislike-number[data-id='"+index+"']").parent(".countVotes").removeClass("text-primary");
						}else{
							$(".dislike-number[data-id='"+index+"']").parent(".countVotes").addClass("text-primary");
							$(".dislike-number[data-id='"+index+"']").parent(".countVotes").removeClass("text-secondary");
							$(".like-number[data-id='"+index+"']").parent(".countVotes").addClass("text-secondary");
							$(".like-number[data-id='"+index+"']").parent(".countVotes").removeClass("text-primary");
						}
						var comments = [];
						if( typeof(value.comments) != "undefined"){
							var comments = JSON.parse(value.comments);
						}
						$(".postComments").html("");
						$.each( comments[language], function( index, value ){
							var fecha = value.DateTime.substr(0, 16);
							if ( value.Vote=="1" ){
								var write = '<div class="d-flex flex-row pb-3" data-nick="'+value.NickName+'"><div class="col-auto p-0"><img src="https://cdn.idcgames.net/img/default/bg-artwork-small.jpg" class="img-user" alt="user" title="User profile"></div><div class="col-11"><div><a class="fontSecondarySmall">'+value.NickName+'</a><span class="text-secondary pl-3">'+fecha+'</span></div><p class="">'+value.Text+'</p><div class="border-bottom border-green-lighter mb-3"><p class="liked text-primary"><i class="fas fa-thumbs-up pr-2"></i>'+value.NickName+' ==(liked_this)==</p></div></div></div>';
							}else{
								var write = '<div class="d-flex flex-row pb-3" data-nick="'+value.NickName+'"><div class="col-auto p-0"><img src="https://cdn.idcgames.net/img/default/bg-artwork-small.jpg" class="img-user" alt="user" title="User profile"></div><div class="col-11"><div><a class="fontSecondarySmall">'+value.NickName+'</a><span class="text-secondary pl-3">'+fecha+'</span></div><p class="">'+value.Text+'</p><div class="border-bottom border-green-lighter mb-3"><p class="disliked text-secondary"><i class="fas fa-thumbs-down pr-2"></i>'+value.NickName+' ==(disliked_this)==</p></div></div></div>';
							}
							$(".postComments").append(write);
						});
					}else{
						$(".like-number[data-id='"+index+"']").text('0');
						$(".dislike-number[data-id='"+index+"']").text('0');
					}
				});
			}
		}
	});
}
/****************************************************************************************************************************/
/*********************************************************  OTHERS  *********************************************************/
/****************************************************************************************************************************/
function addScript( src , clase ) {
  var s = document.createElement( 'script' );
  s.setAttribute( 'src', src );
  if ( typeof(clase) == "string" ){
    s.setAttribute( 'class', clase );
  }
  document.body.appendChild( s );
}
function addScriptJS( theJS ) {
  var s = document.createElement( 'script' );
	s.text = theJS;
  document.body.appendChild( s );
}
</script>
<script>
function drawGame(){
	$(".commonTxt").each(function(){
		var target = $(this).attr("data-tarText");
		$(this).text( gamedata[gameId].common_params[target] );
	});
	$(".commonAtr").each(function(){
		var target = $(this).attr("data-tarAt");
		var attr = $(this).attr("data-attr");
		$(this).attr(attr, gamedata[gameId].common_params[target] );
	});
	$(".commonSubstr").each(function(){
		var target = $(this).attr("data-tarSub");
		var attr = $(this).attr("data-attrSub");
		var val = $(this).attr("data-val");
		var res = val.replace("["+attr+"]",gamedata[gameId].common_params[target]);
		$(this).attr(attr, gamedata[gameId].common_params[target] );
	});
	$(".paramTxt").each(function(){
		var target = $(this).attr("data-tarTextPr");
		$(this).text( gamedata[gameId].store_params[target] );
	});
	$(".paramnAtr").each(function(){
		var target = $(this).attr("data-tarAtPr");
		var attr = $(this).attr("data-attrPr");
		$(this).attr(attr, gamedata[gameId].store_params[target] );
	});
}
</script>