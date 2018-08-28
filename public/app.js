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
      var notesBtn = $("<button>").attr("type", "button").addClass("btn btn-info pull-right mr-2").text("Add Notes").attr("data-id", data[i]._id).attr("value", "notes");
      var a = $("<a>").text(data[i].link).attr("href", data[i].link).addClass("badge badge-warning text-black mr-2");
      $(row).append(p).append(button).append(notesBtn).append(a);
      $("#savedArticles").append(row);
    }
  });


});

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
    $("#notesModal").modal("show");
  }

  if ($(e.target).attr('value') == "delete") {
    var parent = $(e.target).parent();
    var data = {};
    data.articleID = parent.attr("article-id");
    $.post("/deleteSavedArticle/", data, function () {
    })
    parent.remove();
  }

});

