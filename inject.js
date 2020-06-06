function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
let xhr2 = new XMLHttpRequest();
let xhr = new XMLHttpRequest();
xhr.open('GET', ("https://api.showmyhomework.co.uk:443/api/quizzes/"+location.href.substring(location.href.lastIndexOf('/') + 1)), true);
xhr.setRequestHeader('Accept', 'application/smhw.v2020.1+json')
xhr.send();

xhr.onreadystatechange = processRequest;
var ids;
function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
		ids = JSON.parse(xhr.responseText)["quiz"]["question_ids"];
		test=""
		for (var i = 0; i < ids.length; i++) {
			test+=("ids%5B%5D="+ids[i]);
			if (i < (ids.length-1)){test+="&"}
		}
		
		xhr2.open('GET', ("https://api.showmyhomework.co.uk:443/api/quiz_questions?"+test), true);
		xhr2.setRequestHeader('Accept', 'application/smhw.v2020.1+json')
		xhr2.setRequestHeader("Authorization", ("Bearer " + JSON.parse(localStorage.getItem("ember_simple_auth-session")).authenticated.smhw_token))
		xhr2.send({"ids[]":ids});

		xhr2.onreadystatechange = processRequest;

		function processRequest(e) {
			if (xhr2.readyState == 4 && xhr2.status == 200) {
				quiz_questions = JSON.parse(xhr2.responseText)["quiz_questions"];
				outstring="";
				for (var i = 0; i < quiz_questions.length; i++) {
					outstring+="Question Number: " + (i+1) + "\n";
					outstring+="Question: " + quiz_questions[i]["description"] + "\n";
					outstring+="Correct Answer: " + quiz_questions[i]["correct_answer"] + "\n";
					outstring+="\n";
				}
				download("answers.txt", outstring);
			}
		}
			}
}
