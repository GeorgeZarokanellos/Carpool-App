const test = (req,res) => {
    const {name} = req.body;    //destructure the name from the body
    if(name){
        return res.status(200).send(`Welcome ${name}`);
    }
    res.status(401).send('Please provide credentials');
}

module.exports = {
    test,
}
