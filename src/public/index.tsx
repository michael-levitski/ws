/* global React, ReactDOM */
interface Message {
  text: string;
  sentBySelf: boolean;
}

const host = "ss91q-8080.sse.codesandbox.io";
const socket = new WebSocket(`wss://${host}`);

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type KeyEvent = React.KeyboardEvent;

function App() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputText, setInputText] = React.useState("");

  function addNewMessage(message: Message) {
    function setMessagesAction(msgs: Message[]) {
      return [...msgs, message];
    }
    setMessages(setMessagesAction);
  }

  function onMessageRecieved(ev: MessageEvent<string>) {
    const text = ev.data;
    const sentBySelf = false;
    const message = { text, sentBySelf };
    addNewMessage(message);
  }

  function onChange(changeEvent: ChangeEvent) {
    setInputText(changeEvent.target.value);
  }

  function submitMessage() {
    if (inputText === "") return;
    socket.send(inputText);
    setInputText("");
  }

  function onClick() {
    submitMessage();
  }

  function onKeyUp(keyEvent: KeyEvent) {
    if (keyEvent.code === "Enter") submitMessage();
  }

  function getTextFromMessage(message: Message) {
    const { text, sentBySelf } = message;
    if (sentBySelf) return <strong>{text}</strong>;
    return <span>{text}</span>;
  }

  function getListItemFromMessage(message: Message, i: number) {
    const text = getTextFromMessage(message);
    return <li key={i}>{text}</li>;
  }

  socket.onmessage = onMessageRecieved;

  return (
    <>
      <input
        type="text"
        name="input"
        value={inputText}
        onKeyUp={onKeyUp}
        onChange={onChange}
      />
      <button onClick={onClick}>Send</button>
      <hr />
      {messages.length === 0 ? (
        <small>No messages sent / received yet</small>
      ) : (
        <ul>{messages.map(getListItemFromMessage)}</ul>
      )}
    </>
  );
}

const root = document.querySelector("#root");
ReactDOM.render(<App />, root);
