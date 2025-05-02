let currentUser = "";
let users = {};

function registerForm() {
  document.querySelector('.login-form').innerHTML = `
    <h2>ثبت‌نام در ایرانگرام</h2>
    <input type="text" id="newUsername" placeholder="نام کاربری جدید" />
    <button onclick="register()">ثبت‌نام</button>
  `;
}

function register() {
  const newUser = document.getElementById('newUsername').value;
  if (!users[newUser]) {
    users[newUser] = {
      posts: [],
      likes: 0,
      followers: 0,
      stories: [],
      messages: []
    };
    // ورود مستقیم پس از ثبت‌نام
    currentUser = newUser;
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("home").style.display = "block";
    document.getElementById("profile").style.display = "block";
    document.getElementById("story").style.display = "block";
    document.getElementById("chat").style.display = "block";
    document.getElementById("userName").innerText = currentUser;
    updateProfile();
    renderPosts();
    renderStories();
    renderChat();
  } else {
    alert("این نام کاربری قبلاً استفاده شده است.");
  }
}

function login() {
  const username = document.getElementById("username").value;
  if (!users[username]) {
    alert("کاربر وجود ندارد! لطفاً ثبت‌نام کنید.");
    return;
  }
  currentUser = username;
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("home").style.display = "block";
  document.getElementById("profile").style.display = "block";
  document.getElementById("story").style.display = "block";
  document.getElementById("chat").style.display = "block";
  document.getElementById("userName").innerText = currentUser;
  updateProfile();
  renderPosts();
  renderStories();
  renderChat();
}

function addPost() {
  const imageInput = document.getElementById("imageInput").files[0];
  const caption = document.getElementById("captionInput").value;
  if (!imageInput) return alert("لطفاً یک عکس انتخاب کنید");
  const reader = new FileReader();
  reader.onload = () => {
    const post = {
      image: reader.result,
      caption: caption,
      likes: 0
    };
    users[currentUser].posts.push(post);
    renderPosts();
    updateProfile();
  };
  reader.readAsDataURL(imageInput);
}

function renderPosts() {
  const container = document.getElementById("postsContainer");
  const profileContainer = document.getElementById("profilePostsContainer");
  container.innerHTML = "";
  profileContainer.innerHTML = "";
  Object.keys(users).forEach(user => {
    users[user].posts.forEach(post => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <img src="${post.image}" alt="post" />
        <p class="caption">${post.caption}</p>
        <div class="likes">❤️ ${post.likes} <button onclick="likePost('${user}', ${users[user].posts.indexOf(post)})">لایک</button></div>
      `;
      container.appendChild(div);
      if (user === currentUser) profileContainer.appendChild(div.cloneNode(true));
    });
  });
}

function likePost(user, index) {
  users[user].posts[index].likes++;
  users[user].likes++;
  renderPosts();
  updateProfile();
}

function updateProfile() {
  document.getElementById("postCount").innerText = users[currentUser].posts.length;
  document.getElementById("likeCount").innerText = users[currentUser].likes;
  document.getElementById("followerCount").innerText = users[currentUser].followers;
}

function toggleFollow() {
  users[currentUser].followers++;
  updateProfile();
}

function addStory() {
  const file = document.getElementById("storyInput").files[0];
  if (!file) return alert("یک تصویر انتخاب کنید");
  const reader = new FileReader();
  reader.onload = () => {
    users[currentUser].stories.push(reader.result);
    renderStories();
  };
  reader.readAsDataURL(file);
}

function renderStories() {
  const container = document.getElementById("storyList");
  container.innerHTML = "";
  Object.keys(users).forEach(user => {
    users[user].stories.forEach(story => {
      const img = document.createElement("img");
      img.src = story;
      container.appendChild(img);
    });
  });
}

function sendMessage() {
  const msg = document.getElementById("chatInput").value;
  if (!msg) return;
  users[currentUser].messages.push(msg);
  renderChat();
  document.getElementById("chatInput").value = "";
}

function renderChat() {
  const container = document.getElementById("chatMessages");
  container.innerHTML = "";
  users[currentUser].messages.forEach(msg => {
    const p = document.createElement("p");
    p.innerText = msg;
    container.appendChild(p);
  });
}
