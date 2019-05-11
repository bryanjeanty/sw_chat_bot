// import dependencies
import React, { Component, Fragment } from "react";
import Pusher from "pusher-js";

// setup initial variables
const { PUSHER_KEY, PUSHER_CLUSTER } = process.env;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMessage: "",
      conversation: []
    };
  }

  componentDidMount() {
     const pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        encrypted: true
     });

     const channel = pusher.subscribe('bot');
     channel.bind('bot-response', data => {
        const msg = {
           text: data.message,
           user: 'ai'
        };
        this.setState({
           conversation: [...this.state.conversation, msg]
        });
     });
  }

  handleChange = event => {
     this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = event => {
     event.preventDefault();
     if (!this.state.userMessage.trim()) return;

     const msg = {
        text: this.state.userMessage,
        user: 'human'
     }

     this.setState({
        conversation: [...this.state.conversation, msg]
     });

     const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: this.state.userMessage })
     };

     fetch('http://localhost:5000/chat', fetchOptions);

     this.setState({ userMessage: '' });
  }

  render() {
    const ChatBubble = (text, index, className) => {
       return(
          <div key={`${className}-${index}`} className=`${className} chat-bubble`>
             <span className="chat-content">{text}</span>
          </div>
       );
    };

    const chat = this.state.conversation.map((convo, index) => {
       ChatBubble(convo.text, index, convo.user);
    });

    return (
       <div>
          <h1>React Chatbot</h1>
          <div className="chat-window">
             <div className="conversation-view">{chat}</div>
             <div className="message-box">
                <form onSubmit={this.handleSubmit}>
                   <input
                      value={this.state.userMessage}
                      name="userMessage"
                      onInput={this.handleChange}
                      className="text-input"
                      type="text"
                      autofocus
                      placeholder="Enter message..."
                   />
                </form>
             </div>
          </div>
       </div>
    );
  }
}
