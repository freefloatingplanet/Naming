/**
 *
 */
const init = function(){
	$('#searchKeyWord').change(function(){
		execSearch();
	})
	$('#searchButton').click(function(){
		execSearch();
	})
	execSearch();
}

const execSearch = function(){
	let keyword = $('#searchKeyWord').val();
	searchName(keyword);
}

const searchName = function(keyword){
	$("#searchResult").text("");
	$("#records").html("Showing: <b>0</b> result");

	$("#searchResult").text("検索中...");

	$.ajax({
		type: "get",
		url:"/Naming/SearchName",
		dataType:"json",
		data:{
			"keyword": keyword
		}
	}).done((data => {
		$("#searchResult").text("");
		let datalen = data.length;
		$("#records").html("Showing: <b>"+datalen+"</b> result");
		console.log(data);

		if(data.length == 0){
			return;
		}

		let keys = Object.keys(data[0]);

		let rows = "";

		for(let i=0; i<keys.length; i++){
			rows = rows + "<td>" + keys[i] + "</td>";
		}

		rows = "<tr>" + rows + "</tr>";


		for(let i=0; i<data.length; i++){

			let row = "";
			for(let j=0; j<keys.length; j++){
				row = row + "<td>" + data[i][keys[j]] + "</td>";
			}
			rows = rows + "<tr>" + row + "</tr>";
			
		}
		$("#searchResult").append(rows);

	})).fail((data) => {
		$("#searchResult").text("検索失敗");
		console.log('cannot access url');
	})
}

