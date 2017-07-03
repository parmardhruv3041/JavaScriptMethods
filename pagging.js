var itemSearch = '0';
//Pagging Configuration
var totalRecord = 0;
var page = 1;
var recordPerPage = 100;
var start = 1;
var end = recordPerPage;
var tempTotalRecord = null;

$(document).ready(function () {
  
  $('#searchBoxID').on('input', function (e) {
        if ('' == this.value) {
            itemSearch = '0';
            start = 1;
            page = 1;
            end = recordPerPage;
            totalRecord = tempTotalRecord;
            LoadItems('<searchCetogry>', start, end);
            $('#gotoPage').val(page);            
        }
    });
  
  $("#btnSearch").click(function () {
      
        $('#btnNext').hide();
        $('#btnNextLast').hide();
        $('#btnPrevious').hide();
        $('#btnPreviousFirst').hide();        

        itemSearch = $('#searchItem').val();
        start = 1;
        page = 1;
        end = recordPerPage;
        totalRecord = 0;
        searchItem(itemSearch);       
        $('#gotoPage').val(page);        
    });
  
    $("#btnPrevious").click(function () {
        pagging("prev");
        $('#gotoPage').val(page);
    });

    $("#btnNext").click(function () {
        pagging("next");
        $('#gotoPage').val(page);
    });

    $("#btnPreviousFirst").click(function () {
        pagging("prevAll");
        $('#gotoPage').val(page);
    });

    $("#btnNextLast").click(function () {
        pagging("nextAll");
        $('#gotoPage').val(page);
    });

    $('#gotoPage').val(page);

    $('#gotoPage').keyup(function () {
        if (event.keyCode == 13) {
            if ($(this).val() == '0') {
                return;
            }
            goToPage($(this).val());
        }
    });  
});


function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function goToPage(pageNo) {
    var totalPages = Math.ceil(totalRecord / recordPerPage);   

    if (pageNo > totalPages) {
        swal("Warning", "Page not found!", "warning");
        return;
    }

    if (pageNo > 1) {
        $('#btnPrevious').show();
        $('#btnPreviousFirst').show();
    }    

    page = pageNo;
    start = ((page - 1) * recordPerPage) + 1;
    end = ((page - 1) * recordPerPage) + recordPerPage;

    if (itemSearch == '0') {
         LoadItems('<searchCetogry>', start, end);
    } else {
        searchInDB(itemSearch, start, end);
    }   
}

function pagging(action) {   
    if (action == "next") {                       
            $('#btnPrevious').show();
            $('#btnPreviousFirst').show();
            page++;
            var totalPages = Math.ceil(totalRecord / recordPerPage);

           // $("#pageContains").html("Page " + page + " of " + totalPages);
            start = end + 1;
            end = end + recordPerPage;        

            if (itemSearch == '0') {
                LoadItems('<searchCetogry>', start, end);
            } else {              
                searchInDB(itemSearch, start, end);
            }            
            if (totalPages <= page) {
                $('#btnNext').hide();
                $('#btnNextLast').hide();
                return false;
            }

    }else if(action=="prev"){       
        $('#btnNext').show();
        $('#btnNextLast').show();
        var totalPages = Math.ceil(totalRecord / recordPerPage);
        page--;
        end = start - 1;
        start = start - recordPerPage;      

        if (itemSearch == '0') {
           LoadItems('<searchCetogry>', start, end);
        } else {          
            searchInDB(itemSearch, start, end);
        }    

        if (page <= 1) {
            $('#btnPrevious').hide();
            $('#btnPreviousFirst').hide();
            return false;
        }

    } else if (action == "nextAll") {      
        page = Math.ceil(totalRecord / recordPerPage);       
        start = ((page - 1) * recordPerPage) + 1;
        end = totalRecord;
       

        if (itemSearch == '0') {
           LoadItems('<searchCetogry>', start, end);
        } else {         
            searchInDB(itemSearch, start, end);
        }    
      
        $('#btnNextLast').hide();
        $('#btnNext').hide();
        $('#btnPreviousFirst').show();
        $('#btnPrevious').show();

    } else if (action == "prevAll") {       
        start = 1;
        end = recordPerPage;
        page = 1;

        if (itemSearch == '0') {
           LoadItems('<searchCetogry>', start, end);
        } else {         
            searchInDB(itemSearch, start, end);
        }     
      
        $('#btnPreviousFirst').hide();
        $('#btnPrevious').hide();
        $('#btnNextLast').show();
        $('#btnNext').show();
    }   
}

function searchItem(itemSearch) {    
    searchInDB(itemSearch, start, end);   
}

function searchInDB(itemSearch, start, end) {      
    var res = itemSearch.split("'");
    itemSearch = res[0];
    $.ajaxSetup({
        url: 'ItemMap.aspx/searchItem',
        data: "{'item': '" + itemSearch + "','start':" + start + ",'end':" + end + "}",
        dataType: "JSON",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $(".modal").show();
        },
        complete: function () {
            $(".modal").hide();
        }
    });

    $.ajax({
        success: function (datap) {
            if (datap.d != null) {              
                items = datap.d.items;
                totalRecord = datap.d.totalRecords;   
                if (totalRecord > recordPerPage) {
                  if (end < totalRecord) {
                    $('#btnNext').show();
                    $('#btnNextLast').show();           
                  } else {
                    $('#btnNext').hide();
                    $('#btnNextLast').hide();
                  }                
                }
            }
        },
        error: function (response) {
            swal("Error response", response.responseText, "error");
        },
        failure: function (response) {
            swal("Error", response.responseText, "error");
        }
    });
}
