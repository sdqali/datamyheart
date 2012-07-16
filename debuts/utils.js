utils = {
    capitalize: function(w) {
	return w.replace(w.charAt(0), w.charAt(0).toUpperCase());
    },

    humanize: function(str, excludeList) {
	excludeList = excludeList || []
	return str.split(" ").map(function(w){
	    if(excludeList.indexOf(w) != -1) {
		return w;
	    } else {
		return utils.capitalize(w);
	    }
	}).join(" ");
    }
};
