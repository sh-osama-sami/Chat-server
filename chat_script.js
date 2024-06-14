// alert('form chat script')

let username_h1 = document.getElementById(
    'username');
let chat_div  =document.getElementById('chat');
let chat_msg = document.getElementById('chatmsg')
let send_btn = document.getElementById('send')
let clear_btn = document.getElementById('clear')
let online_lst = document.getElementById('online')



username= prompt('Please enter your name : ')
username_h1.innerHTML =username
// use websocket to connection to the web socket server

let mywebsocket = new WebSocket('ws://localhost:8000'); // connected to server
console.log('here',mywebsocket);
console.log("iti")



// 1- open connection

mywebsocket.onopen = function (){
    console.log('connection opened');
    // I need to send the server myname ??
    // best practice while sending data is to prepare it in form object
    msg_to_send  ={
        type: "login",
        username: username
    }

    mywebsocket.send(JSON.stringify(msg_to_send))
}



// 2- on message ?
mywebsocket.onmessage= function (event){
    console.log(event)
    let received_msg = JSON.parse(event.data)
    console.log(received_msg.online)
    if (received_msg.type==='login'){
        chat_div.innerHTML +=`<h3 style="color: green; text-align: center">${received_msg.body}</h3>`
    }else if(received_msg.type==='logout'){
        chat_div.innerHTML +=`<h3 style="color: red; text-align: center">${received_msg.body}</h3>`

    } else if(received_msg.type==='chat'){
        chat_div.innerHTML +=`<h3 class="w-50 bg-light rounded-2 p-2 mx-2 " >${received_msg.body}</h3>`

    }

    online_lst.innerHTML = ''
    online_users = received_msg.online
    online_users.forEach((user)=>{
        online_lst.innerHTML += `<li id="${user.id}"> ${user.name} </li>`
    })





}

send_btn.addEventListener('click', function (){
    let msg_val = `${username}:${chat_msg.value}.`
    let msg_to_send= {
        type: 'chat',
        body: msg_val
    }
    chat_div.innerHTML +=`<h2  class="w-50 ms-auto bg-warning  rounded-2 p-2 mx-2 " >Me:${chat_msg.value}</h2>`
    msg_to_send= JSON.stringify(msg_to_send);
    mywebsocket.send(msg_to_send);
    chat_msg.value = '';

})

clear_btn.addEventListener('click', function (){
    chat_div.innerHTML ='';
})


// 3- close the connection