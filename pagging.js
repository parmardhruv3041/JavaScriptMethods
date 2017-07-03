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
  
});
