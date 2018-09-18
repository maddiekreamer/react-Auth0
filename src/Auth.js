/* eslint no-restricted-globals:0*/
import auth0 from "auth0-js";

const LOGIN_SUCCESS_PAGE = "/secret"
const LOGIN_FAILURE_PAGE = "/"

class Auth {
    auth0 = new auth0.WebAuth({
        domain: "anhuelita.auth0.com",
        clientID: "chOvEHXSCIdBc04owcc8H61yGB0xE3bb",
        redirectUri: "http://localhost:3000/callback",
        audience: "https://anhuelita.auth0.com/userinfo",
        responseType: "token id_token",
        scope: "openid"
    })

    constructor(){
        this.login = this.login.bind(this)
    }

    login(){
        this.auth0.authorize()
    }

    handleAuthentication(){
        this.auth0.parseHash((err, authResults) => {
            if(authResults && authResults.accessToken && authResults.idToken){
                let expiresAt = JSON.stringify((authResults.expiresIn) * 1000 + new Date().getTime())
                localStorage.setItem("access_token", authResults.accessToken)
                localStorage.setItem("id_token", authResults.idToken)
                localStorage.setItem("expires_at", expiresAt)
                location.hash = ""
                location.pathname = LOGIN_SUCCESS_PAGE
            }
            else if(err){
                location.pathname = LOGIN_FAILURE_PAGE
            }
        })
    }

    isAuthenticated(){
        let expires_at = JSON.parse(localStorage.getItem("expires_at"))
        return new Date().getTime() < expires_at
    }

    logout(){
        localStorage.removeItem("access_token")
        localStorage.removeItem("id_token")
        localStorage.removeItem("expires_at")
        location.pathname = LOGIN_FAILURE_PAGE
    }
}

export default Auth