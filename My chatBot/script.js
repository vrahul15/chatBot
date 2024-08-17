"use strict";
// console.log("Hey I'm working!");

const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-List");

let userMessage = null;

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

//API Key's and url's
const API_KEY = "AIzaSyAeGgj6hO7x-fBRRsRA0AOeB7fzRpgJE4M";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Fetching response from the api based on user message
const generateApiResponse = async (incomingMessageDiv) => {
  // console.log(incomingMessageDiv.innerHTML);
  const textElement = incomingMessageDiv.querySelector(".text");

  if (!textElement) {
    console.error("Text element not found in incomingMessageDiv.");
    return;
  }
  // Sending POST request to the api with the user's message
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();
    const apiResponse = data?.candidates[0].content.parts[0].text;

    // textElement.innerText = apiResponse;

    if (!apiResponse) {
      console.error("API response is invalid or missing.");
      textElement.innerText =
        "Sorry, I couldn't get a response. Please try again.";
    } else {
      textElement.innerText = apiResponse;
    }
  } catch (error) {
    console.log(error);
    textElement.innerText = "There was an error processing your request.";
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
};

//Made with 💝 by inxd!
const showLoadingAnimation = () => {
  console.log("I'm fine");

  const html = `<div class="message incoming  ">
        <div class="message-content">
          <img src="images/gemini.svg" alt="" class="avatar" />
          <div class="text">           
          </div>
          
          <div class="loading-indicator">
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
          </div>
        </div>
        <span class="icon material-symbols-rounded">content_copy</span>
        
      </div>`;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatList.appendChild(incomingMessageDiv);

  generateApiResponse(incomingMessageDiv);
};

//Made with 💝 by inxd!

const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim();
  if (!userMessage) return; // If userMessage is null, it returns. i.e., Exit if there is no message.
  const html = `<div class="message-content">
          <img src="./images/ayush.jpg" alt="" class="avatar" />
          <div class="text"></div>
        </div>`;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  //   console.log(userMessage);
  chatList.appendChild(outgoingMessageDiv);

  typingForm.reset();
  setTimeout(showLoadingAnimation, 500);
};

// To prevent the default activity (submission) and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  handleOutgoingChat();
});
