function ListViewMethods(record) {
	try {
		if ( record.view !== 'list' ) {
			throw 'Only possible from the list-view';
		}
	}
	catch(err) {
		console.log(err);
	}
	
	this.record = record;
}

ListViewMethods.prototype.advertise = function(value) {
	// value (str): Mervärde att locka med
	
	var a = this.record.subElements.cover.find('a');
	
	if ( a.find('ul.values').length === 0 ) {
		a.append('<ul class="values"></ul>');
	}
	
	a.find('ul.values').append('<li>' + value + '</li>');	
};