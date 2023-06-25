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
	let jQResultHead = $('#searchResultHead');
	let jQResultBody = $('#searchResultBody');
	let jQRecords = $('#records');

	jQResultHead.text("");
	jQResultBody.text("");
	jQRecords.html("Showing: <b>0</b> result");

	jQResultBody.text("検索中...");

	$.ajax({
		type: "get",
		url:"/Naming/SearchName",
		dataType:"json",
		data:{
			"keyword": keyword
		}
	}).done((result => {
		let data = result.data;
		let conf = result.conf;
		jQResultHead.text("");
		jQResultBody.text("");
		let datalen = data.length;
		jQRecords.html("Showing: <b>"+datalen+"</b> result");
		console.log(data);

		if(data.length == 0){
			return;
		}

		let keys = Object.keys(data[0]);
		// ヘッダーを作成
		let rows = "";
		for(let i=0; i<keys.length; i++){
			rows = rows + "<td>" + keys[i] + "</td>";
		}
		rows = "<tr>" + rows + "</tr>";
		jQResultHead.append(rows);

		// ボディを作成
		rows = "";
		for(let dt of data){

			let row = "";
			for(let key of keys){

				// キーワードにマッチする箇所をハイライトする
				let hdt = dt[key];
				if(conf.searchKeys.includes(key)){
					hdt = highlightWord(hdt,keyword);
				}

				row = row + "<td>" + hdt + "</td>";
			}
			rows = rows + "<tr>" + row + "</tr>";
			
		}
		jQResultBody.append(rows);

	})).fail((result) => {
		jQResultBody.text("検索失敗");
		console.log('cannot access url');
	})
}

const highlightWord = function(eleHtml,word){
	let ret = eleHtml;
	if(word){
		let searchString = '(' + word + ')';
		let regExp = new RegExp( searchString, "gi");
		let replaceString = '<span style="background-color:#ffcc99">$1</span>';
		let resultHtml = eleHtml.replace(regExp, replaceString);
		ret = resultHtml;
	}
	return ret;
}