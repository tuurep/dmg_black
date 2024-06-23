function save_cache() {
    // TODO: localStorage isn't working properly in web-greeter
    // See: 
    // https://www.reddit.com/r/linuxquestions/comments/12uhsyr/comment/jh8yi8o/?utm_source=share&utm_medium=web2x&context=3

    const user = window.users.selected.id;
    const session = window.sessions.selected.id;
    
    // Cache user to select it at start next time
    localStorage.setItem("LAST_USER", user);

    // Cache session - each user remembers the session they last logged into
    localStorage.setItem(user, session);
}

function start_authentication() {
    lightdm.cancel_authentication();
    window.loginbutton.disabled = false;
    lightdm.authenticate(window.users.selected.id);
}

function attempt_login() {
    if (lightdm.is_authenticated) {
        save_cache();
        lightdm.start_session(window.sessions.selected.id);
    } else {
        const errormessage  = document.querySelector("#error-message");
        errormessage.textContent = "Incorrect password";
        password.value = "";
        start_authentication();
    }
}

function set_loginform() {
    const form = document.querySelector("form");
    const password = document.querySelector("#password");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        window.loginbutton.disabled = true;
        lightdm.respond(password.value);
    });

    // Signal - Emits after clicking on Login button
    lightdm.authentication_complete.connect(attempt_login);
}

function set_powerbuttons() {
    if (lightdm.can_restart) {
        const button = document.querySelector("#restart");
        button.style.display = "inline-block";
        button.addEventListener("click", () => lightdm.restart());
    }
    if (lightdm.can_shutdown) {
        const button = document.querySelector("#shutdown");
        button.style.display = "inline-block";
        button.addEventListener("click", () => lightdm.shutdown());
    }
}

class Users {

    constructor() {
        this.selected = document.querySelector("#users .select-value");
        this.list = document.querySelector("#users .select-menu");

        this.init_userlist();
    }

    init_userlist() {
        for (const user of lightdm.users) {
            const id = user.username;
            const text = user.username;
            const li = document.createElement("li");
            li.id = id;
            li.textContent = text;
            li.addEventListener("click", () => this.select_user(id, text));
            this.list.appendChild(li);
        }
    }

    select_user(id, text) {
        this.list.querySelector(".selected")?.classList.remove("selected");
        this.list.querySelector(`#${id}`).classList.add("selected");

        this.selected.id = id;
        this.selected.textContent = text;

        if (id in localStorage) {
            const last_session = localStorage.getItem(id);
            const li = window.sessions.list.querySelector(`#${last_session}`);
            window.sessions.select_session(li.id, li.textContent);
        } else {
            // This user has never logged in
            // select first session in dropdown list
            const first = window.sessions.list.children[0];
            window.sessions.select_session(first.id, first.textContent);
        }

        start_authentication();
    }
}

class Sessions {

    constructor() {
        this.selected = document.querySelector("#sessions .select-value");
        this.list = document.querySelector("#sessions .select-menu");

        this.init_sessionlist();
    }

    init_sessionlist() {
        for (const session of lightdm.sessions) {
            const id = session.key;
            const text = session.name;
            const li = document.createElement("li");
            li.id = id;
            li.textContent = text;
            li.addEventListener("click", () => this.select_session(id, text));
            this.list.appendChild(li);
        }
    }

    select_session(id, text) {
        this.list.querySelector(".selected")?.classList.remove("selected");
        this.list.querySelector(`#${id}`).classList.add("selected");

        this.selected.id = id;
        this.selected.textContent = text;
    }
}

function set_dropdown_lists() {
    window.users = new Users();
    window.sessions = new Sessions();

    // Select user who last attempted login
    if ("LAST_USER" in localStorage) {
        const last_user = localStorage.getItem("LAST_USER");
        const li = window.users.list.querySelector(`#${last_user}`);
        window.users.select_user(li.id, li.textContent);
    } else {
        // If first time, select first user in dropdown list
        const first = window.users.list.children[0];
        window.users.select_user(first.id, first.textContent);
    }

    // Close user and session dropdowns on focusout
    const dropdowns = document.querySelectorAll(".select");
    for (const d of dropdowns) {
        d.addEventListener("focusout", () => {
            d.querySelector(".select-input").checked = false;
        });
    }
}

async function init_greeter() {
    if (lightdm.can_access_brightness) {   
        document.addEventListener("keydown", (e) => {
            if (e.key === "F5") {
                lightdm.brightness_decrease(5);
            }
            if (e.key === "F6") {
                lightdm.brightness_increase(5);
            }
        })
    }

    window.loginbutton = document.querySelector("form button");

    set_dropdown_lists();
    set_powerbuttons();
    set_loginform();
}

window.addEventListener("GreeterReady", init_greeter);
