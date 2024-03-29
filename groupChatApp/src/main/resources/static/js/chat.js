var socket = new SockJS('/chat');
var stompClient = Stomp.over(socket);
var name = '';

document.getElementById('name-button').addEventListener('click', function() {
    setName();
});

document.getElementById('send-button').addEventListener('click', function() {
    sendMessage();
});

function setName() {
    var nameInput = document.getElementById('name-input');
    name = nameInput.value.trim();
    if (name) {
        nameInput.value = '';
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('name-button').style.display = 'none';
        document.getElementById('message-input').style.display = 'block';
        document.getElementById('send-button').style.display = 'block';
    }
}

function sendMessage() {
    var messageInput = document.getElementById('message-input');
    var message = messageInput.value.trim();
    if (message) {
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({'content': name + ': ' + message}));
        messageInput.value = '';
    }
}

stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/public', function(message) {
        showMessage(JSON.parse(message.body));
    });
});

function showMessage(message) {
    var messageList = document.getElementById('message-list');
    var li = document.createElement('li');
    li.textContent = message.content;
    messageList.appendChild(li);
}