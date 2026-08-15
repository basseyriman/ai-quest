const { io } = require("socket.io-client");

const socket = io("http://localhost:3001", {
    path: "/socket.io/",
});

socket.on("connect", () => {
    console.log("Connected with id:", socket.id);
    socket.emit("join-room", { roomId: "DEV-TEST", playerName: "TerminalAgent" });
});

socket.on("gameState-updated", (state) => {
    console.log("Received GameState:");
    const me = state.players[socket.id];
    console.log("My Player State:", me);
    console.log("Total Deck Count:", state.deck.length);
    process.exit(0);
});

socket.on("connect_error", (err) => {
    console.log("Connect Error:", err.message);
});
