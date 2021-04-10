const chatForm = document.getElementById('chat-form'); 
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//changing username and room using url

const {username, room} = Qs.parse(location.search,{

    ignoreQueryPrefix: true

});

//using socket

const socket = io();

//joining 
socket.emit('joinroom', {username,room});


//room and users

socket.on('roomUsers', ({ room, users}) => {

    outputRoomName( room );
    outputRoomUsers(users);



})



//msg
socket.on('message', message =>{

    console.log(message);
    outputMessage(message);

    //Scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;


})

//sending message
chatForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const msg = e.target.elements.msg.value;  // msg input by user

    //msg to server
    socket.emit('chatMessage', msg);

     // after display clear feild
     e.target.elements.msg.value = "";
     e.target.elements.msg.focus();

} )

//Output message function

function outputMessage(message){

     const div = document.createElement('div');
     div.classList.add('message');
     div.innerHTML =`<p class="meta">${message.username} <span>${message.time}</span></p>
     <p class="text">
         ${message.text}
     </p>`;

     document.querySelector('.chat-messages').appendChild(div);    //printing the above para
}


// fn roomname output 

function outputRoomName(room){

    roomName.innerText = room;

}

// usernames display 
function outputRoomUsers(users){

    userList.innerHTML = 
    `
    ${users.map( user => `<li>${user.username}</li>`).join('')}
    
    `;

}