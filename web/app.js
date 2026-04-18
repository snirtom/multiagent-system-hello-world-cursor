function HelloWorldMessage(messageElement, visible) {
  messageElement.hidden = !visible;
}

function PrimaryActionButton(buttonElement, onPress) {
  buttonElement.addEventListener("click", onPress);
}

function HelloWorldScreen() {
  const showMessageButton = document.getElementById("showMessageButton");
  const helloWorldMessage = document.getElementById("helloWorldMessage");

  if (!showMessageButton || !helloWorldMessage) {
    return;
  }

  const viewState = {
    isMessageVisible: false,
  };

  const render = () => {
    HelloWorldMessage(helloWorldMessage, viewState.isMessageVisible);
  };

  const onPrimaryActionPress = () => {
    viewState.isMessageVisible = true;
    render();
  };

  PrimaryActionButton(showMessageButton, onPrimaryActionPress);
  render();
}

HelloWorldScreen();
