$(document).ready(function () {  
	//use for searching table contains
    $('#searchBoxID').keyup(function () {
        searchTable($(this).val());
    });
	
	//use for pagging of table row
	pagging();
	
	//use in table when you check all table checkbox on single header checkbox click
	$('#headerCheckBoxID').click(function () {
        if ($(this).prop("checked") == true) {
            checkAll();
        } else {
            unCheckAll();
        }
    });	
});

//use for allow only number in input text
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode != 46 && charCode > 31
	&& (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function checkAll() {
    $('#tableID tbody>tr').each(function (index, row) {
        if ($(this).is(':visible')) {
            if ($(this).find(':checkbox').prop('checked') == false) {
                $(this).find(':checkbox').prop('checked', true);             
            }
        }
    });    
}

function unCheckAll() {
    $('#tableID tbody>tr').each(function (index, row) {
        if ($(this).is(':visible')) {
            if ($(this).find(':checkbox').prop('checked') == true) {
                $(this).find(':checkbox').prop('checked', false);               
            }
        }
    });  
}

function searchTable(inputVal) {
    var table = $('#tblStockTranslist');
    table.find('tr').each(function (index, row) {
        var allCells = $(row).find('td');
        if (allCells.length > 0) {
            var found = false;
            allCells.each(function (index, td) {
                var regExp = new RegExp(inputVal, 'i');
                if (regExp.test($(td).text())) {
                    found = true;
                    return false;
                }
            });
            if (found == true) $(row).show(); else $(row).hide();
        }
    });
}



function pagging() {    
    var totalRows = $('#tblStockTranslist').find('tbody tr:has(td)').length;
    var recordPerPage = 20;
    var totalPages = Math.ceil(totalRows / recordPerPage);  

    for (i = 0; i < totalPages; i++) {
        $('<span class="button">&nbsp;' + (i + 1) + '</span>&nbsp;').appendTo("div#pageNumber");
    }
     
    $('#tblStockTranslist').find('tbody tr:has(td)').hide();
    var tr = $('table#tblStockTranslist tbody tr:has(td)');
    for (var i = 0; i <= recordPerPage - 1; i++) {
        $(tr[i]).show();
    }

    $('span').click(function (event) {
        $('#tblStockTranslist').find('tbody tr:has(td)').hide();

        var nBegin = ($(this).text() - 1) * recordPerPage;
        var nEnd = $(this).text() * recordPerPage - 1;

        for (var i = nBegin; i <= nEnd; i++) {
            $(tr[i]).show();
        }
    });       
}

//use for calling webservices and api
$.ajaxSetup({
	url: url,
	data: '{ "data": ' + JSON.stringify(data) + ' }',//if required,remove JSON.stringify(),when you passing json Data.Here Data is list or object
	dataType: "json",
	type: "POST",//define method GET,POST,DELETE,etc
	contentType: "application/json; charset=utf-8",
	beforeSend: function () {
		$(".modal").show(); //show progressbar
	},
	complete: function () {
		$(".modal").hide(); //close progress bar
	}
});
$.ajax({

	success: function (response) {
		//server response
	},
	error: function (error) {
		//error response
	},
	failure: function (failure) {
		//failure response
	}
});

//use for focus last row of table
function FocusLastRow() {
    var count = $('#tableID tr').length;
    var obj = $('#tableID tr')[count - 1];
    $(obj).find('#txtMKTPLNAME').focus();
}

//EVENT FOR SPECIAL CHARACTER----
// for example :-> <input type="text" onkeypress="return blockSpecialChar(event)" maxlength="50" required /> 
function blockSpecialChar(e) {
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k <= 48 && k >= 57));
}

	