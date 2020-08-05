module.exports = {

    auth: function(req, res, next){
        if(req.isAuthenticated()){
            next()
        }else{
            res.redirect('/')
        }
    },

    guest: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }else{
            next()
        }
    }

}