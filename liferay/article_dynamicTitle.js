(function() {
	var dynamicTitle = document.createElement('script');
	dynamicTitle.type = 'text/javascript';
	dynamicTitle.innerHTML = '(function(){var d=document.getElementsByClassName("arena-articledet-title"),a=[],c="";for(var b=0;b<d.length;b++){a.push(d[b].textContent.trim())}switch(a.length){case 2:c=a[0]+": "+a[1];break;case 1:c=a[0];break}c+=" - Vimmerby bibliotek";document.title=c}());';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(dynamicTitle, s);
}());

