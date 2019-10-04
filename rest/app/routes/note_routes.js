module.exports = function(app, db) {
    app.post('/notes', (req, res) => {
        const note = { text: req.body.body, title: req.body.title};
        db.collection('notes').insert(note, (err, results) => {
            if (err) {
                res.send('error');
            } else {
                res.send(results.ops[0]);
            }
        });
    });
};