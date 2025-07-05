// Load existing users or set defaults
let communityUsers = JSON.parse(localStorage.getItem("communityUsers")) || [
  { name: "Aanya", teach: "Figma", learn: "Python", status: "Waiting" },
  { name: "Raj", teach: "Video Editing", learn: "Canva", status: "Waiting" },
  { name: "Kriti", teach: "Canva", learn: "Video Editing", status: "Waiting" },
  { name: "Arjun", teach: "Python", learn: "Figma", status: "Waiting" }
];

// Save updated community to localStorage
function saveCommunity() {
  localStorage.setItem("communityUsers", JSON.stringify(communityUsers));
}

// Handle form submission
document.getElementById("skillForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const teach = document.getElementById("teach").value.trim();
  const learn = document.getElementById("learn").value.trim();
  const resultDiv = document.getElementById("matchResult");

  if (!name || !teach || !learn) return;

  const teachLower = teach.toLowerCase();
  const learnLower = learn.toLowerCase();

  // Try to find a matching user
  const match = communityUsers.find(
    (user) =>
      user.teach.toLowerCase() === learnLower &&
      user.learn.toLowerCase() === teachLower &&
      user.status === "Waiting"
  );

  let status = "Waiting";

  if (match) {
    status = "Matched";
    match.status = "Matched"; // Update the matched user's status

    resultDiv.innerHTML = `
      <div class="match-box">
        🎉 <strong>Match found!</strong><br>
        You can SkillSwap with <strong>${match.name}</strong>.<br>
        They want to learn <strong>${teach}</strong> and can teach you <strong>${learn}</strong>!
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="match-box" style="background-color: #ffecec; border-color: #f5c2c2; color: #b30000;">
        ❌ No exact match found yet.<br>
        But your entry has been added to the community!
      </div>
    `;
  }

  // Add new user entry
  const newUser = {
    name,
    teach,
    learn,
    status
  };

  communityUsers.push(newUser);
  saveCommunity();
  updateUserList();
  document.getElementById("skillForm").reset();
});

// Display latest 6 joiners
function updateUserList() {
  const containerId = "userList";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className = "latest-joiners-grid";
    document.querySelector(".signup-section").appendChild(container);
  }

  container.innerHTML = "";

  const latest = communityUsers
    .filter(user => user.name && user.teach)
    .slice(-6)
    .reverse();

  latest.forEach((user) => {
    const card = document.createElement("div");
    card.className = "joiner-card";

    const learn = user.learn?.trim() !== "" ? user.learn : "—";
    const statusIcon =
      user.status === "Matched" ? "✅ Matched" :
      user.status === "OfferOnly" ? "📦 Offer Only" : "⏳ Waiting";

    card.innerHTML = `
      <strong>${user.name}</strong><br>
      Teaches: <em>${user.teach}</em><br>
      Wants to learn: <em>${learn}</em><br>
      Status: ${statusIcon}
    `;
    container.appendChild(card);
  });
}

// Initial render
updateUserList();
