const host = 'localhost';
const port = 3000;
let user = ''



const mode = () => {
    if (document.getElementById("body").style.backgroundImage == `url("assets/bg-light.png")`) {
        document.getElementById("body").style.backgroundImage = "url(assets/bg-dark.png)";
        document.getElementById("mode").innerHTML = "light_mode";

    } else {
        document.getElementById("body").style.backgroundImage = "url(assets/bg-light.png)";
        document.getElementById("mode").innerHTML = "dark_mode";
        document.getElementById("body").style.color = "white";
    }
}

const login = () => {
    const un_text = document.getElementById('un_input').value;
    const pwd_text = document.getElementById('pwd_input').value;
    if (un_text.trim() != '' && pwd_text.trim() != '') {
        fetch(`http://${host}:${port}/${un_text.trim()}`)
            .then(res => res.json())
            .then(data => {
                if (data[0].password === pwd_text.trim() && data.length === 1) {
                    document.querySelector('#incorrect').style.display = 'none';
                    location.replace(`http://${host}:${port}/user${un_text.trim()}`)
                } else {
                    document.querySelector('#incorrect').style.display = 'block'
                }
            })
            .catch(error => {
                document.querySelector('#incorrect').style.display = 'block'
            })

    }
    if (un_text.trim() == '') {
        document.querySelector('#un_error').style.display = 'block';
    } else {
        document.querySelector('#un_error').style.display = 'none';
    }
    if (pwd_text.trim() == '') {
        document.querySelector('#pwd_error').style.display = 'block';
    } else {
        document.querySelector('#pwd_error').style.display = 'none';
    }

}

const show = (field) => {
    if (field === 'show_pwd') {
        const show_pwd = document.getElementById('show_pwd');
        const pwd_input = document.getElementById('pwd_input');
        if (show_pwd.innerHTML.trim() == 'visibility') {
            show_pwd.innerHTML = 'visibility_off';
            pwd_input.type = "text";
        } else {
            show_pwd.innerHTML = 'visibility';
            pwd_input.type = "password";
        }
    }
    if (field === 'show_cpwd') {
        const show_cpwd = document.getElementById('show_cpwd');
        const cpwd_input = document.getElementById('cpwd_input');
        if (show_cpwd.innerHTML.trim() == 'visibility') {
            show_cpwd.innerHTML = 'visibility_off';
            cpwd_input.type = "text";
        } else {
            show_cpwd.innerHTML = 'visibility';
            cpwd_input.type = "password"
        }
    }
}

document.getElementById('body').addEventListener('keydown', (key) => {
    if (key.key == 'Enter'){
        login()
    }
})