
var whichIsEmpty = function(datas){
  var length = datas.length;
  for(var i=0; i<length; i++){
    console.log(i +  " : " + datas[i]);
    if(datas[i].trim()==""){
       return i;
    }
  }
  return -1;
};
var reset = function(){

  var inputs = $($("tr[name='textboard']")[0]).find("input");
  var length = inputs.length;

  for(var i=0; i<length; i++){
    inputs[i].value = "";
  }

  var selects = $($("tr[name='textboard']")[0]).find("select");
  length = selects.length;

  for(var i=0; i<length; i++){
    selects[i].value = "";
  }
   
  search();
};

var search = function(){
  var textboard = $("tr[name='textboard']")[0];

  var campus = $(textboard).find("input[name='campus']")[0].value;
  var owner = $(textboard).find("input[name='owner']")[0].value;
  var relationFee = $(textboard).find("select[name='relationFee']")[0].value;
  var initialSending = $(textboard).find("select[name='initialSending']")[0].value;
  var deposit = $(textboard).find("select[name='deposit']")[0].value;
  var contract = $(textboard).find("select[name='contract']")[0].value;
  var approval = $(textboard).find("select[name='approval']")[0].value;
  var regiDate = $(textboard).find("input[name='regiDate']")[0].value;
  var description = $(textboard).find("input[name='description']")[0].value;

  var datas = [campus, owner, relationFee, initialSending
                , deposit, contract, approval, regiDate, description ];

  var filterCount = 0;
  for(var i=0; i<datas.length; i++){
    if(datas[i]!=""){
      filterCount++;
    }
  }

	var tbody = document.getElementsByName('mainTable')[0].getElementsByTagName('tbody')[0];
  $(tbody).find("tr").each(function(){
    $(this).show()
  });

  if(filterCount==0){
    return;
  }

  makeHidden(tbody, "campus", campus);
  makeHidden(tbody, "owner", owner);
  makeHidden(tbody, "relationFee", relationFee);
  makeHidden(tbody, "initialSending", initialSending);
  makeHidden(tbody, "deposit", deposit);
  makeHidden(tbody, "contract", contract);
  makeHidden(tbody, "approval", approval);
  makeHidden(tbody, "regiDate", regiDate);
  makeHidden(tbody, "description", description);
};

var makeHidden = function(tbody, name, value){
  console.log("name : " + name);
  console.log("value : " + value);
  if(value.trim()==""){
    return;
  }

  $(tbody).find("p[name='"+name+"']:not([data-value*='"+value+"'])").each(function(){
    $(this).parent().parent().hide();
  });  
};

var save = function(){
  var textboard = $("tr[name='textboard']")[0];

  var campus = $(textboard).find("input[name='campus']")[0].value;
  var owner = $(textboard).find("input[name='owner']")[0].value;
  var relationFee = $(textboard).find("select[name='relationFee']")[0].value;
  var initialSending = $(textboard).find("select[name='initialSending']")[0].value;
  var deposit = $(textboard).find("select[name='deposit']")[0].value;
  var contract = $(textboard).find("select[name='contract']")[0].value;
  var approval = $(textboard).find("select[name='approval']")[0].value;
  var regiDate = $(textboard).find("input[name='regiDate']")[0].value;
  var description = $(textboard).find("input[name='description']")[0].value;

  var datas = [ campus, owner ];

  if((number = whichIsEmpty(datas)) > -1){
     alert("잘못된 값이 존재합니다. : " + number);
     return;
  }

  var postData = {
    campus: campus,
    owner: owner,
    relationFee: relationFee,
    initialSending: initialSending,
    deposit: deposit,
    contract: contract,
    approval: approval,
    regiDate: regiDate,
    description: description
  };


  var key = $(textboard).find("input[name='key']")[0].value;
  console.log("key : " + key);

  if(key.trim()===""){
    key = firebase.database().ref().child('board1').push().key;
  }

  console.log("key : " + key);

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/board1/' + key] = postData;

  firebase.database().ref().update(updates);

  reset();
};

var read = function(){
  var boardRef = firebase.database().ref('board1/');

  boardRef.on('child_added', function(data) {
    addRow(data.key, data.val());
  });

  boardRef.on('child_changed', function(data) {
    changRow(data.key, data.val());
  });

  boardRef.on('child_removed', function(data) {
    removeRow(data.key);
  });

};

var removeRow = function(key){
  $("tr#"+key).remove();
};

var findText = function(selectName, value){
  if(value.trim()==""){
    return "";
  }
  var textboard = $("tr[name='textboard']")[0];
  try{
    return $(textboard).find("select[name='"+selectName+"'] > option[value='"+value+"']").text();
  }catch(e){
    console.log(e);
    return value;
  }
};

var addRow = function(key, rowData){
	var tbody = document.getElementsByName('mainTable')[0].getElementsByTagName('tbody')[0];
  var row = tbody.insertRow(0);
  row.id = key;
  row.insertCell(0).innerHTML = makeTd("checkBox", "", "<input type='checkbox' name='"+key+"'/>");
  row.insertCell(1).innerHTML = makeTd("campus", rowData.campus, rowData.campus);
  row.insertCell(2).innerHTML = makeTd("owner", rowData.owner, rowData.owner);
  row.insertCell(3).innerHTML = makeTd("relationFee", rowData.relationFee, findText("relationFee",rowData.relationFee));
  row.insertCell(4).innerHTML = makeTd("initialSending", rowData.initialSending, findText("initialSending",rowData.initialSending));
  row.insertCell(5).innerHTML = makeTd("deposit", rowData.deposit, findText("deposit",rowData.deposit));
  row.insertCell(6).innerHTML = makeTd("contract", rowData.contract, findText("contract",rowData.contract));
  row.insertCell(7).innerHTML = makeTd("approval", rowData.approval, findText("approval",rowData.approval));
  row.insertCell(8).innerHTML = makeTd("regiDate", rowData.regiDate, rowData.regiDate);
  row.insertCell(9).innerHTML = makeTd("description", rowData.description, rowData.description);

  $(row).click(function(){
    peek(this);
  });
};


var changRow = function(key, rowData){
  var tds = $("tr#"+key).find("td");
  
  tds[0].innerHTML = makeTd("checkBox", "", "<input type='checkbox' name='"+key+"'/>");
  tds[1].innerHTML = makeTd("campus", rowData.campus, rowData.campus);
  tds[2].innerHTML = makeTd("owner", rowData.owner, rowData.owner);
  tds[3].innerHTML = makeTd("relationFee", rowData.relationFee, findText("relationFee",rowData.relationFee));
  tds[4].innerHTML = makeTd("initialSending", rowData.initialSending, findText("initialSending",rowData.initialSending));
  tds[5].innerHTML = makeTd("deposit", rowData.deposit, findText("deposit",rowData.deposit));
  tds[6].innerHTML = makeTd("contract", rowData.contract, findText("contract",rowData.contract));
  tds[7].innerHTML = makeTd("approval", rowData.approval, findText("approval",rowData.approval));
  tds[8].innerHTML = makeTd("regiDate", rowData.regiDate, rowData.regiDate);
  tds[9].innerHTML = makeTd("description", rowData.description, rowData.description);

};

var del = function(){
  var boxes = $("input:checked");

  var updates = {};
  for(var i=0; i<boxes.length; i++){
    updates['/board1/' + boxes[i].name] = null;
  }

  firebase.database().ref().update(updates);
};

var makeTd = function(name, value, txt){
    return '<p name="' + name + '" data-value="' + value + '">' + txt + '</p>';
};


var peek = function(el){
  var rowDatas = $("tr#"+el.id).find("p");
  
  var textboard = $("tr[name='textboard']")[0];

  $(textboard).find("input[name='key']")[0].value = el.id;
  $(textboard).find("input[name='campus']")[0].value = $(rowDatas[1]).data("value");
  $(textboard).find("input[name='owner']")[0].value = $(rowDatas[2]).data("value");
  $(textboard).find("select[name='relationFee']")[0].value = $(rowDatas[3]).data("value");
  $(textboard).find("select[name='initialSending']")[0].value = $(rowDatas[4]).data("value");
  $(textboard).find("select[name='deposit']")[0].value = $(rowDatas[5]).data("value");
  $(textboard).find("select[name='contract']")[0].value = $(rowDatas[6]).data("value");
  $(textboard).find("select[name='approval']")[0].value = $(rowDatas[7]).data("value");
  $(textboard).find("input[name='regiDate']")[0].value = $(rowDatas[8]).data("value");
  $(textboard).find("input[name='description']")[0].value = $(rowDatas[9]).data("value");
};


$(document).ready(function(){

  read();

  $("button[name='save']").click(function(){
    save();
  });

  $("button[name='reset']").click(function(){
    reset();
  });


  $("button[name='delete']").click(function(){
    del();
  });


  $("button[name='search']").click(function(){
    search();
  });

});

