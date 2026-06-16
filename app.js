const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const filePath = "./courses.json";


// helper: read
const getCourses = () => {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// helper: write
const saveCourses = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};


// GET all courses
app.get("/courses", (req, res) => {
    const courses = getCourses();
    res.json(courses);
});


// GET single course
app.get("/courses/:id", (req, res) => {
    const courses = getCourses();
    const id = parseInt(req.params.id);

    const found = courses.find(c => c.id === id);

    if (!found) {
        return res.status(404).json({ message: "Course not found" });
    }

    res.json(found);
});


// ADD course
app.post("/courses", (req, res) => {
    const courses = getCourses();

    const newId = courses.length > 0
        ? courses[courses.length - 1].id + 1
        : 1;

    const newCourse = {
        id: newId,
        title: req.body.title,
        duration: req.body.duration,
        fee: req.body.fee
    };

    courses.push(newCourse);
    saveCourses(courses);

    res.json(newCourse);
});


// UPDATE course
app.put("/courses/:id", (req, res) => {
    const courses = getCourses();
    const id = parseInt(req.params.id);

    const course = courses.find(c => c.id === id);

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    course.title = req.body.title || course.title;
    course.duration = req.body.duration || course.duration;
    course.fee = req.body.fee || course.fee;

    saveCourses(courses);

    res.json(course);
});


// DELETE course
app.delete("/courses/:id", (req, res) => {
    let courses = getCourses();
    const id = parseInt(req.params.id);

    const exists = courses.find(c => c.id === id);

    if (!exists) {
        return res.status(404).json({ message: "Course not found" });
    }

    courses = courses.filter(c => c.id !== id);
    saveCourses(courses);

    res.json({ message: "Course deleted successfully" });
});


// server
app.listen(2000, () => {
    console.log("Server running on port 2000");
});