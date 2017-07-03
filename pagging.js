var itemSearch = '0'; //use to search in DB
//Pagging Configuration
var totalRecord = 0; //total records for pagging
var page = 1;
var recordPerPage = 100; // use to allow only 100 recourds to be load
var start = 1;
var end = recordPerPage;
var tempTotalRecord = null; // use to store temp. total recourd value when user search item in DB. 

$(document).ready(function () {
  
  //search box in html
  //<input type="Search" id="searchBoxID" placeholder="Search code or item name"/>
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
  //search button click
  //<input type="Button" id="btnSearch" class="button" value="Search"/>
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
  
    //navigation button
    // <input type="button" id="btnPreviousFirst" value="<<" />                                  
    // <input type="button" id="btnPrevious" value="<" />
    // <input type="button" id="btnNext" value=">" />
    // <input type="button" id="btnNextLast" value=">>" />                                    
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
    
    // use to navigate on page
    //<p id="pageNo">Page Number<input type="text" style="padding: 0;text-align: center;" id="gotoPage" value="1" onkeypress="return isNumberKey(event)"/></p>
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

//only allow number 
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

//navigates on page 
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

//call when user click on navigation symboll like next,nextall,previous,etc
function pagging(action) {   
    if (action == "next") {                       
            $('#btnPrevious').show();
            $('#btnPreviousFirst').show();
            page++;
            var totalPages = Math.ceil(totalRecord / recordPerPage); // count total page based on recourds
        
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
