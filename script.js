const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");

const scrollToBottom = () => {
    chatWindow.scrollTop = chatWindow.scrollHeight;
};

const createMessageBubble = (text, role) => {
    const bubble = document.createElement("div");
    bubble.classList.add("message", role);
    bubble.textContent = text;
    return bubble;
};

const createTypingBubble = () => {
    const bubble = document.createElement("div");
    bubble.classList.add("message", "assistant");
    const dots = document.createElement("div");
    dots.className = "typing";
    dots.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    bubble.appendChild(dots);
    return bubble;
};

const addMessage = (text, role) => {
    const bubble = createMessageBubble(text, role);
    chatWindow.appendChild(bubble);
    scrollToBottom();
    return bubble;
};

const handleSend = async (event) => {
    event.preventDefault();
    const userText = messageInput.value.trim();
    if (!userText) return;

    addMessage(userText, "user");
    messageInput.value = "";

    const typingBubble = createTypingBubble();
    chatWindow.appendChild(typingBubble);
    scrollToBottom();

    try {
        const response = await fetch("/api/generatePost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userInput: userText }),
        });

        if (!response.ok) {
            throw new Error("Failed to reach the AI assistant. Please try again.");
        }

        const data = await response.json();
        chatWindow.removeChild(typingBubble);
        addMessage(data.generatedPost || "(No response received)", "assistant");
    } catch (error) {
        chatWindow.removeChild(typingBubble);
        addMessage(error.message || "Something went wrong.", "assistant");
    }
};

chatForm.addEventListener("submit", handleSend);

messageInput.focus();
