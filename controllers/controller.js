var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models")

router.get("/", function (req, res) {
    res.render("index");
});



router.get("/scrape", function (req, res) {
    axios.get("https://news.ycombinator.com/").then(function (response) {

        var $ = cheerio.load(response.data);
        console.log(response.data);
        var count = 0;
        $(".athing").each(function (i, element) {
            var result = {};
            result.title = $(this)
                .children()
                .children("a")
                .text();
            result.articleID = $(this)
                .attr("id");
            result.link = $(this)
                .children().children("a")
                .attr("href");

            db.Article.findOne({ "articleID": result.articleID }, function (err, data) {
                if (!data) {
                    console.log(result.articleID, "Was NOT Found");
                    db.Article.create(result)
                        .then(function (dbArticle) {
                            // console.log(dbArticle);
                        })
                        .catch(function (err) {
                            return res.json(err);
                        });
                } else {
                    console.log(data.articleID, "Was Found")
                }
            })
            count++;
        })
        res.send({ count: count });
    });
});

router.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});
router.get("/savedArticles", function (req, res) {
    db.SavedArticle.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.post("/deleteSavedArticle/", function (req, res) {
    db.SavedArticle.deleteOne({articleID:req.body.articleID})
        .then(function () {
            console.log();
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/articleNotes/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    var id = req.params.id
    // console.log(id);
    db.SavedArticle.findOne({ _id: id })  
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // console.log(dbArticle)
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



router.post("/saveArticle/:id", function (req, res) {
    db.SavedArticle.findOne({ "articleID": req.body.articleID }, function (err, data) {
        if (!data) {
            console.log(req.body.articleID, "Saving Article");
            db.SavedArticle.create(req.body)
                .then(function (dbArticle) {
                    // console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        } else {
            console.log(req.body.articleID, "Was saved already")
        }

    });
});``

// Route for saving/updating an Article's associated Note
router.post("/notes/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.SavedArticle.findOneAndUpdate({ _id: req.params.id }, {$push:{ note: dbNote._id }}, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.post("/deleteNote/:id", function(req, res){
    console.log(req.body.id)
    db.Note.deleteOne({_id:req.body.noteId})
    .then(function () {
        console.log();
    })
    .catch(function (err) {
        res.json(err);
    });
    console.log(req.params.id);
    console.log(req.body.noteId);
    db.SavedArticle.findOneAndUpdate({_id:req.params.id}, {$pull:{note:req.body.noteId}});
})

module.exports = router;