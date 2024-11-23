const host = 'localhost';
const port = 3000;

const mode = () => {
    console.log(document.getElementById("body").style.backgroundImage)
    if (document.getElementById("body").style.backgroundImage == `url("assets/bg-light.png")`) {
        document.getElementById("body").style.backgroundImage = "url(assets/bg-dark.png)";
        document.getElementById("mode").innerHTML = "light_mode";

    } else {
        document.getElementById("body").style.backgroundImage = "url(assets/bg-light.png)";
        document.getElementById("mode").innerHTML = "dark_mode";
        document.getElementById("body").style.color = "white";
    }
}

let current_date = () => {
    let usable = new Date();
    let h = usable.getHours();
    let m = usable.getMinutes();
    let date = usable.getDate();
    let month = usable.getMonth() + 1;
    let year = usable.getFullYear();
    let returnable = date + "/" + month + "/" + year + "   " + h + ":" + m;
    return returnable
}

const signup = () => {
    const fn_text = document.getElementById('fn_input').value;
    const ln_text = document.getElementById('ln_input').value;
    const un_text = document.getElementById('un_input').value;
    const pwd_text = document.getElementById('pwd_input').value;
    const cpwd_text = document.getElementById('cpwd_input').value;
    const dob_text = () => {
        if (document.getElementById('dob_input').value.trim() != '') return document.getElementById('dob_input').value.trim()
    };
    const male_text = document.getElementById('male_input');
    const female_text = document.getElementById('female_input');
    const none_text = document.getElementById('none_input');
    const gender = () => {
        if (male_text.checked) return "male";
        if (female_text.checked) return "female";
        if (none_text.checked) return "none"
    }
    if (
        fn_text.trim() != '' &&
        ln_text.trim() != '' &&
        un_text.trim() != '' &&
        pwd_text.trim() != '' &&
        cpwd_text.trim() != '' &&
        cpwd_text.trim() === pwd_text.trim()
    ) {
        const res = fetch(`http://${host}:${port}/signup`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
            firstname : `${fn_text.trim()}`,
            lastname: `${ln_text.trim()}`,
            username: `${un_text.trim()}`,
            password: `${pwd_text.trim()}`,
            gender: `${gender()}`,
            dob: `${dob_text()}`,
            date: `${current_date()}`})
        });
        location.replace(`http://${host}:${port}/home.html`)
    }
    if (fn_text.trim() == '') {
        document.querySelector('#fn_error').style.display = 'block';
    } else {
        document.querySelector('#fn_error').style.display = 'none';
    }
    if (ln_text.trim() == '') {
        document.querySelector('#ln_error').style.display = 'block';
    } else {
        document.querySelector('#ln_error').style.display = 'none';
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
    if (cpwd_text.trim() != pwd_text) {
        document.querySelector('#cpwd_error').style.display = 'block';
    } else {
        document.querySelector('#cpwd_error').style.display = 'none';
    }
}

const preventDefault = (a) => {
    const male_text = document.getElementById('male_input');
    const female_text = document.getElementById('female_input');
    const none_text = document.getElementById('none_input');
    if (a == 'male') {
        female_text.checked = false;
        none_text.checked = false;
    } else if (a == 'female') {
        male_text.checked = false;
        none_text.checked = false;
    } else {
        female_text.checked = false;
        male_text.checked = false;
    }
}

document.getElementById('male_input').addEventListener('click', () => { preventDefault('male') })
document.getElementById('female_input').addEventListener('click', () => { preventDefault('female') })
document.getElementById('none_input').addEventListener('click', () => { preventDefault('none') })

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

