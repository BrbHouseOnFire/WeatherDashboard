









$('#searchBox').keypress(function(e) {
    if (e.which == 13) {
        $('#searchSubmit').click(); 
    }
});

// make a call when the user searches
$('#searchSubmit').on('click', function() {
    // save user's search value
    let userSearch = $('#searchBox').val();
    makeCall(userSearch);
});


