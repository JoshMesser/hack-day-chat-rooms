const params = (document.location.search.match( new RegExp("([^?=&]+)(=([^&]*))?", 'g' ) ) || [])
	.reduce( function(result , each) {
		let [ key, value ] = each.split('=');
		result[ decodeURIComponent( key ) ] = decodeURIComponent(value);
		return result;
	}, {});

// expose this to other scripts
window.params = params;