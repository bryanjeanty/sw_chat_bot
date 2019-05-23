// import dependencies
import React, { Component } from "react";
import Pusher from "pusher-js";

// import styles
import {
  chatTitleStyles,
  chatWindowStyles,
  convoViewStyles,
  msgBoxStyles,
  textInputStyles,
  formStyles,
  chatBubbleStyles,
  chatContentStyles
} from "../styles/AppStyles.js";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMessage: "",
      conversation: []
    };
  }

  componentDidMount() {
    const pusher = new Pusher(process.env.PUSHER_KEY, {
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true
    });

    const channel = pusher.subscribe("bot");
    channel.bind("bot-response", data => {
      const msg = {
        text: data.message,
        user: "ai"
      };
      this.setState({
        conversation: [...this.state.conversation, msg]
      });
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.userMessage.trim()) return;

    const msg = {
      text: this.state.userMessage,
      user: "human"
    };

    this.setState({
      conversation: [...this.state.conversation, msg]
    });

    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: this.state.userMessage })
    };

    fetch("https://localhost:5100/chat", fetchOptions);

    this.setState({ userMessage: "" });
  };

  render() {
    const ChatBubble = (text, index, className) => {
      return (
        <div
          style={chatBubbleStyles}
          key={`${className}-${index}`}
          className="chat-bubble"
        >
          <span
            style={chatContentStyles}
            className={`${className} chat-content`}
          >
            {text}
          </span>
        </div>
      );
    };

    //if (this.state.conversation.length) {
    const chat = this.state.conversation.map((convo, index) => {
      return ChatBubble(convo.text, index, convo.user);
    });
    //}

    return (
      <div>
        <h1 style={chatTitleStyles} className="chat-title">
          React Chatbot
        </h1>
        <div style={chatWindowStyles} className="chat-window">
          <div style={convoViewStyles} className="conversation-view">
            {chat}
          </div>
          <div style={msgBoxStyles} className="message-box">
            <form style={formStyles} onSubmit={this.handleSubmit}>
              <input
                style={textInputStyles}
                value={this.state.userMessage}
                name="userMessage"
                onChange={this.handleChange}
                className="text-input"
                type="text"
                placeholder="Enter message..."
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
