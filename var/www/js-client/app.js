"use strict"

const statusField = document.querySelector(".status-field");

const loginForm = document.querySelector("#login-form");
const loginDiv = document.querySelector("#login-div");

const postPoem = document.querySelector("#post-poem");

const getPoem = document.querySelector("#get-poem");

const getAll = document.querySelector("#get-all-poems");


const DEFAULT_DEBUG_TEXT = "Debug: --- Start --- <br>";

let loginstatus="0";
let current_user;

let cookie_string;
let cookie = document.cookie;
let current_cookie_id_value = "";


if(cookie != "") 
    current_cookie_id_value = cookie.split('=')[1];


//service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("sw.js")
    .then(registration => console.log(registration))
    .catch(error => alert(error)); 
}


//check if user is already logged in
if(current_cookie_id_value != "") {
    const url = "http://localhost:8000/cgi-bin/rest.py/loginstatus";
    const data_check = `<check><sessionid>${current_cookie_id_value}</sessionid></check>`;
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/xml",
            "Accept": "application/xml"
        },
        body: data_check
    })
    .then(response => response.text())
    .catch(error => alert(error))
    .then(data => {
        

        statusField.innerHTML = `${DEFAULT_DEBUG_TEXT}Loginstatus xml: ${data}`;
        window.scrollTo(0, 0);

        const xmlData = new DOMParser().parseFromString(data,"text/xml");
        const STATUSCODE = xmlData.getElementsByTagName("status")[0].childNodes[0].nodeValue;
        const USER = xmlData.getElementsByTagName("user")[0].childNodes[0].nodeValue;
        console.log(STATUSCODE, USER);
        loginstatus = STATUSCODE;
        current_user = USER;
        statusField.innerHTML += `<br/>Loginstatuscode: "${STATUSCODE}" - User: "${USER}`;

        setLoginEnv(USER);




    });
}



//this one will be assigned once a login has been made


//login and logout -- These must be under an event target listener because they are dynamic elements in the DOM
document.addEventListener("click", event => {
    event.preventDefault();

    /*---------------LOGIN---------------*/
    if (event.target && event.target.id == "login") {

        const url = "http://localhost:8000/cgi-bin/rest.py/login";
    
        //const username = loginForm.elements.inp_user.value;
        //let password = loginForm.elements.inp_password.value;
        const username = "henrik@mixdesign.no";
    
    
        statusField.innerHTML = `${DEFAULT_DEBUG_TEXT} Username: ${username}<br>`;
    
        const hashpassword = "c95eb7a16be87c2cfdb9e049b83a053a53453b18424eee39388eb5ba8d516dc7";
    
        //const post_data = `<user><username>${username}</username><password>${hashpassword}</password></user>`;
        const post_data = "<user><username>henrik@mixdesign.no</username><password>c95eb7a16be87c2cfdb9e049b83a053a53453b18424eee39388eb5ba8d516dc7</password></user>";
    
            
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml",
                "Accept": "application/xml"
            },
            body: `<user><username>${username}</username><password>${hashpassword}</password></user>`
        })
        .then(response => response.text())
        .catch(error => alert(error))
        .then(data => {
    
            const xmlData = new DOMParser().parseFromString(data,"text/xml");
    
            const STATUSCODE = xmlData.getElementsByTagName("status")[0].childNodes[0].nodeValue;
            const NEWSESSIONID = xmlData.getElementsByTagName("sessionid")[0].childNodes[0].nodeValue;
    
            console.log(STATUSCODE, NEWSESSIONID);
            loginstatus = STATUSCODE;
    
        
            if(STATUSCODE == "1") {
                current_user = username;
    
                document.cookie = `user_session=${NEWSESSIONID}`;
                
    
                cookie_string = `Set-cookie:${document.cookie}`;
    
                statusField.innerHTML += `Logget inn vellykket:  ${data}`;
            
                setLoginEnv(username);
            }
            else {
                statusField.innerHTML =`${DEFAULT_DEBUG_TEXT}Feil ved innlogging`;
                document.cookie = "";
                cookie_string = `Set-cookie:${document.cookie}`;        }
    
        });
        window.scrollTo(0, 0);

    }
    /*---------------LOGOUT---------------*/
    else if(event.target && event.target.id == "logout") {
        console.log("clicked");

        document.cookie = "user_session=0; expires=Wed, 14-Feb-2001 05:53:40 GMT;";
        cookie_string = `Set-cookie:${document.cookie}`;

        const session_to_logout=current_cookie_id_value

        const url ="http://localhost:8000/cgi-bin/rest.py/logout"
        const data = `<user><sessionid>"${session_to_logout}"</sessionid></user>`

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml",
                "Accept": "application/xml"
            },
            body: data
        })
        .then(response => response.text())
        .catch(error => alert(error))
        .then(data => {
            
            const xmlData = new DOMParser().parseFromString(data,"text/xml");
            const STATUSCODE = xmlData.getElementsByTagName("status")[0].childNodes[0].nodeValue;

            if(STATUSCODE == "1") {
                loginstatus = "0";
                statusField.innerHTML = `${DEFAULT_DEBUG_TEXT}Logget ut`;
                document.cookie = "user_session=0; expires=Wed, 14-Feb-2001 05:53:40 GMT;";
                cookie_string = `Set-cookie:${document.cookie}`;
                console.log(document.cookie);
                setLogoutEnv();
            }


            else
                statusField.innerHTML = `${DEFAULT_DEBUG_TEXT}Kunne ikke logge ut`
        });
        window.scrollTo(0, 0);

    }

    /*---------------POST---------------*/
    else if(event.target && event.target.id == "create") {
        event.preventDefault();


        const poem = document.querySelector("#create-poem").elements.dikttekst.value;

        if(poem == "")
            statusField.innerHTML = `${DEFAULT_DEBUG_TEXT} Diktfeltet er tomt!`;
    
        else {
            const url = "http://localhost:8000/cgi-bin/rest.py/diktsamling/dikt/"
    
            const data = `<dikt><text>${poem}</text></dikt>`;
    
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/xml",
                    "Accept": "application/xml"
                },
                credentials: 'include',
                body: data
            })
            .then(response => response.text())
            .catch(error => alert(error))
            .then(data => statusField.innerHTML = `${DEFAULT_DEBUG_TEXT}${data}`);
        }
        window.scrollTo(0, 0);

    }

    /*---------------PUT---------------*/
    else if(event.target && event.target.id == "update") {
        
        const updateForm = document.querySelector("#update-poem");

        const poemId = updateForm.elements.inp_diktid.value;
        const poem = updateForm.elements.inp_dikttekst.value;


        if(poemId == "")
            statusField.innerHTML = `${DEFAULT_DEBUG_TEXT}DiktId ikke angitt`;
        else if(poem == "")
        statusField.innerHTML = `${DEFAULT_DEBUG_TEXT}Dikttekst ikke angitt`;
        else {
            const url = `http://localhost:8000/cgi-bin/rest.py/diktsamling/dikt/${poemId}`;
            
            const data = `<dikt><text>${poem}</text></dikt>`;

            fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/xml",
                    "Accept": "application/xml"
                },
                credentials: "include",
                body: data
            })
            .then(response => response.text())
            .catch(error => alert(error))
            .then(data => statusField.innerHTML = `${DEFAULT_DEBUG_TEXT}${data}`)
        }

        window.scrollTo(0, 0);
    }

    /*---------------DELETE---------------*/
    else if(event.target && event.target.id == "delete") {

        const poemId = document.querySelector("#delete-poem").elements.inp_diktid.value;

        if(poemId != "") {
            const url = `http://localhost:8000/cgi-bin/rest.py/diktsamling/dikt/${poemId}`;
            const data = "";

            fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/xml",
                    "Accept": "application/xml"
                },
                credentials: "include",
                body: data
            })
            .then(response => response.text())
            .catch(error => alert(error))
            .then(data => statusField.innerHTML = `${DEFAULT_DEBUG_TEXT} Slette ett dikt: ${data}`);
        }
        
        else
            statusField.innerHTML = `${DEFAULT_DEBUG_TEXT}Diktid er ikke angitt - kan ikke slette dikt`;
        window.scrollTo(0, 0);

    }

    /*---------------DELETE ALL---------------*/
    else if(event.target && event.target.id == "delete_all") {
        console.log("Delete all");
        
        /*const url=`http://localhost:8000/cgi-bin/rest.py/diktsamling/dikt/`;
        const data ="";

        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/xml",
                "Accept": "application/xml"
            },
            credentials: "include",
            body: data
        })
        .then(response => response.text())
        .catch(error => alert(error))
        .then(data => statusField.innerHTML = `${DEFAULT_DEBUG_TEXT} Slette alle dikt: ${data}`);*/
        window.scrollTo(0, 0);

    }

 });


//get poem
getPoem.elements.read_poem.addEventListener("click", event => {
    event.preventDefault();

    const poemId = getPoem.elements.diktid.value;


    //if np poem ID is presented
    if(poemId == "")
        statusField.innerHTML = `${DEFAULT_DEBUG_TEXT} Diktid er ikke angitt - kan ikke hente dikt`;

    else {
        const url = `http://localhost:8000/cgi-bin/rest.py/diktsamling/dikt/${poemId}`;

        fetch(url, {
            mehtod: "GET",
            headers: {
                "Content-Type": "application/xml", 
                "Accept": "application/xml"
            }    
        })
        .then(response => response.text())
        .catch(error => alert(error))
        .then(data => {
            //empy data length is 23
            if(data.length <= 23)
                statusField.innerHTML = `${DEFAULT_DEBUG_TEXT} Ingen dikt med id = ${poemId}`;
            else
                statusField.innerHTML = `${DEFAULT_DEBUG_TEXT} ${data}`;
        });
    }
    window.scrollTo(0, 0);

});

//gets all poems
getAll.elements.read_all.addEventListener("click", event => {  
    event.preventDefault();
    const url = "http://localhost:8000/cgi-bin/rest.py/diktsamling/dikt/";

    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/xml", 
            "Accept": "application/xml"
        },
        credentials: "include"

    })
    .then(response => response.text())
    .catch(error => console.log(error))
    .then(data => {
        statusField.innerHTML = `${DEFAULT_DEBUG_TEXT} ${data}`;
    });
    window.scrollTo(0, 0);

});

//sets login environment
const setLoginEnv = username => {
    loginDiv.innerHTML = `<p>Du er logget inn som: ${username}</p>
    <FORM ACTION="" METHOD="POST" ID="logout-form">
    <INPUT TYPE="hidden" NAME="todo" VALUE="logout">
    <INPUT TYPE="submit" ID="logout" VALUE="Logg ut">
    </FORM>`;


    const postPoem = document.createElement("div");
    const putPoem = document.createElement("div");
    const deletePoem = document.createElement("div");
    const deleteAllPoems = document.createElement("div");


    postPoem.innerHTML = `<div class="form-div" id="create_div">
    <p>Lag nytt dikt</p>
    <FORM ACTION="" METHOD="POST", ID="create-poem">
    <INPUT TYPE="hidden" NAME="todo" VALUE="Post">
    <INPUT TYPE="text" NAME="dikttekst" VALUE="">
    <INPUT TYPE="submit" ID="create" VALUE="Lagre nytt dikt">
    </FORM>
    </div>`;

    putPoem.innerHTML = `<div class="form-div" id="update_div">
    <p>Rediger dikt</p>
    <FORM ACTION="" METHOD="POST" id="update-poem">
    <INPUT TYPE="hidden" NAME="todo" VALUE="Put">
    <label for="inp_diktid">Angi dikt-id</label>
    <INPUT TYPE="text" NAME="diktid" ID="inp_diktid" VALUE="">
    <label for="inp_dikttekst">Ny tekst</label>
    <INPUT TYPE="text" NAME="dikttekst" ID="inp_dikttekst" VALUE="">
    <INPUT TYPE="submit" ID="update" VALUE="Endre dikt">
    </FORM>
    </div>`;

    deletePoem.innerHTML = `<div class="form-div" id="delete_div">
    <p>Slett et dikt</p>
    <FORM ACTION="" ID="delete-poem" METHOD="POST">
    <INPUT TYPE="hidden" NAME="todo" VALUE="Delete">
    <label for="inp_diktid">Angi dikt-id</label>
    <INPUT TYPE="text" NAME="diktid" id="inp_diktid" VALUE="">
    <INPUT TYPE="submit" ID="delete" VALUE="Slett dikt">
    </FORM>
    </div>`;

    deleteAllPoems.innerHTML =     `<div class="form-div" id="delete_all_div">
    <p>Slett alle mine dikt</p>
    <FORM ACTION="" ID="delete-all-poems" METHOD="POST">
    <INPUT TYPE="hidden" NAME="todo" VALUE="Deleteall">
    <INPUT TYPE="submit" ID="delete_all" VALUE="Slett alle dikt">
    </FORM>
    </div>`;

    document.body.appendChild(postPoem);
    document.body.appendChild(putPoem);
    document.body.appendChild(deletePoem);
    document.body.appendChild(deleteAllPoems);


}

//sets the environment
const setLogoutEnv = () => {
    
    loginDiv.innerHTML = `<p>Du må logge inn</p>
    <FORM ACTION="" ID="login-form" METHOD="POST">
    <INPUT TYPE="hidden" NAME="todo" VALUE="login">
    <label for="inp_user">Brukernavn</label>
    <INPUT TYPE="text" NAME="username" ID="inp_user" VALUE="">
    <label for="inp_password">Passord</label>
    <INPUT TYPE="password" NAME="password" ID="inp_password" VALUE="">
    <INPUT TYPE="submit" ID="login" VALUE="Logg inn">
    </FORM>`;
    const postPoem = document.querySelector("#create_div");
    const putPoem = document.querySelector("#update_div");
    const deletePoem = document.querySelector("#delete_div");
    const deleteAllPoems = document.querySelector("#delete_all_div");
    postPoem.remove();
    putPoem.remove();
    deletePoem.remove();
    deleteAllPoems.remove();


}