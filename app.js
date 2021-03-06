var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express();

//App config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Mongoose config
var blogSchema = new mongoose.Schema({
    title: String,
    image: {
        type: String,
        default: "something" //"https://cdn.pixabay.com/photo/2014/12/27/15/40/office-581131_960_720.jpg"
    },
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog", blogSchema);

//Restful route
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("index", {
                blogs: blogs
            });
        }
    });
});

//NEW 
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});


//SHOW
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", {
                blog: blog
            });
        }
    });
});

//EDIT
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log("/blogs");
        }
        else {
            res.render("edit", {
                blog: blog
            });
        }
    });
});


//UPDATE
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            console.log("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//DESTROY
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs/" + req.params.id);
        }
        else {
            res.redirect("/blogs");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running!");
});
