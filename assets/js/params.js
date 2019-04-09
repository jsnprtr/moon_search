window.apollo = window.apollo || {};

window.apollo.Params = function(){
	var params = [];
	
	var addParam =  function(name, val){
		var existingParam = getParam(name);
		if(!existingParam){
			params.push({"name": name, "value": val});
		} else {
			for(var i = 0; i < params.length; i++){
				if(params[i].name == name){
					params[i].value = val;
				}
			}
		}
	};

	var getParam = function(name){
		for(var i = 0; i < params.length; i++){
			if(name == params[i].name){
				return params[i].value;
			}
		}
	};

	var buildQueryString = function(){
		return params.map(function(elem){return elem.name + "=" + elem.value;}).join('&');
	};
	return {getParam: getParam,
			addParam: addParam,
			buildQueryString: buildQueryString};
};