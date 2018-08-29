$("#scraped").on("click", function () {
  $("#message").hide();
  $("#savedContainer").hide();
  $("#articlesContainer").show();
  $.get("/scrape", function (res) {
    $("#scrapeMessage").text(res.count + " articles scraped. Please wait while the articles are retrieved...")
    $("#scraperModal").modal("show");
  }).then(function () {
    $.getJSON("/articles", function (data) {
      $("#articles").empty();
      for (i in data) {
        var row = $("<div>").addClass("p-3 mb-2 bg-primary text-white rounded").attr("data-id", data[i]._id).attr("article-id", data[i].articleID).attr("link", data[i].link).attr("title", data[i].title);
        var p = $("<p>").text(data[i].title).attr("data-id", data[i]._id);
        var button = $("<button>").attr("type", "button").addClass("btn btn-success pull-right mr-2").text("Save").attr("data-id", data[i]._id).attr("value", "save");
        var a = $("<a>").text(data[i].link).attr("href", data[i].link).addClass("mr-2 badge badge-warning text-black");
        $(row).append(p).append(button).append(a);
        $("#articles").append(row);
      }
    });
  });
});

$("#saved").on("click", function () {
  $("#message").hide();
  $("#savedContainer").show();
  $("#articlesContainer").hide();

  $.getJSON("/savedArticles", function (data) {
    $("#savedArticles").empty();
    for (i in data) {
      var row = $("<div>").addClass("p-3 mb-2 bg-primary text-white rounded").attr("data-id", data[i]._id).attr("article-id", data[i].articleID).attr("link", data[i].link).attr("title", data[i].title);
      var p = $("<p>").text(data[i].title).attr("data-id", data[i]._id);
      var button = $("<button>").attr("type", "button").addClass("btn btn-danger pull-right mr-2").text("Delete").attr("data-id", data[i]._id).attr("value", "delete");
      var notesBtn = $("<button>").attr("type", "button").addClass("btn btn-info pull-right mr-2").text("Notes").attr("data-id", data[i]._id).attr("value", "notes");
      var a = $("<a>").text(data[i].link).attr("href", data[i].link).addClass("badge badge-warning text-black mr-2");
      $(row).append(p).append(button).append(notesBtn).append(a);
      $("#savedArticles").append(row);
    }
  });


});

var currentSelectedId;

$(document).on("click", function (e) {
  if ($(e.target).attr('value') == "save") {
    var parent = $(e.target).parent();
    var data = {};
    data.title = parent.attr("title");
    data.link = parent.attr("link");
    data.id = parent.attr("data-id");
    data.articleID = parent.attr("article-id");
    $.post("/saveArticle/" + e.target, data, function () {
    })
    $(e.target).text('Saved!!');
  }

  
  if ($(e.target).attr('value') == "notes") {
    $("#savedNotes").empty();
    var parent = $(e.target).parent();
    currentSelectedId = parent.attr("data-id")
    // console.log(currentSelectedId);
    $.get("/articleNotes/" + currentSelectedId, function (data) {
      // console.log(data);
      var notesArray = data.note;
      if (notesArray !== undefined){
        for (note in notesArray){
          var noteDiv = $("<div>").addClass("row ");
          var col = $("<div>").addClass("col-10 rounded bg-dark text-white m-1").text(notesArray[note].body);
          var delNoteBtn = $("<button>").attr("type", "button").addClass("btn btn-danger pull-right mr-2").text("X").attr("data-id", notesArray[note]._id).attr("value", "deleteNote");
          $(noteDiv).append(col).append(delNoteBtn);
          $("#savedNotes").append(noteDiv);
          // console.log(notesArray[note]);
          
        }
        
      }
    })
    $("#notesModal").modal("show");
  }

  if ($(e.target).attr('value') == "saveNote"){
    var note = $("#noteText").val().trim();
    if (note!=""){
      $.post("/notes/" + currentSelectedId, {body: note}).then(function(){
        $("#noteText").val("");
      });

    }

  }

  if ($(e.target).attr('value') == "delete") {
    var parent = $(e.target).parent();
    var data = {};
    data.articleID = parent.attr("article-id");
    $.post("/deleteSavedArticle/", data, function () {
    });
    parent.remove();
  }

  if ($(e.target).attr('value') == "deleteNote") {
    var parent = $(e.target).parent();
    var data = {};
    data.noteId = $(e.target).attr("data-id");
    $.post("/deleteNote/" + currentSelectedId, data, function () {
    });
    parent.remove();
  }

});












// Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then(function(data) {
//       // console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });

// When you click the savenote button
// $(document).on("click", "#savenote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });
