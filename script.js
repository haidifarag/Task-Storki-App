document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("hashchange", navigate);
  navigate(); // initial load
});

function navigate() {
  const hash = location.hash;

  if (hash.startsWith("#post/")) {
    const postId = hash.split("/")[1];
    loadPostDetails(postId);
  } else {
    loadPostsList();
  }
}

function loadPostsList() {
  showLoading();
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((posts) => {
      hideLoading();
      renderPosts(posts);
    })
    .catch(() => {
      showError("Error while loading posts.");
    });
}

function loadPostDetails(postId) {
  showLoading();
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((res) => res.json())
    .then((post) => {
      return Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`).then((r) => r.json()),
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`).then((r) => r.json()),
      ]).then(([user, comments]) => {
        hideLoading();
        renderPostDetails(post, user, comments);
      });
    })
    .catch(() => {
      showError("Error while loading post details.");
    });
}

// UI Functions

function renderPosts(posts) {
  const app = document.getElementById("app");
  app.innerHTML = "<h1>Posts</h1>";
  const list = document.createElement("div");

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h2><a href="#post/${post.id}">${post.title}</a></h2>
      <p>${post.body.slice(0, 100)}...</p>
    `;
    list.appendChild(div);
  });

  app.appendChild(list);
}

function renderPostDetails(post, user, comments) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <button onclick="location.hash = ''">← Back</button>
    <div class="post">
      <h1>${post.title}</h1>
      <p>${post.body}</p>
    </div>
    <h3>Author</h3>
    <p><strong>${user.name}</strong> — ${user.email} (${user.company.name})</p>
    <h3>Comments</h3>
  `;

  comments.forEach((comment) => {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";
    commentDiv.innerHTML = `
      <h4>${comment.name}</h4>
      <p><strong>${comment.email}</strong></p>
      <p>${comment.body}</p>
    `;
    app.appendChild(commentDiv);
  });
}

function showLoading() {
  document.getElementById("app").innerHTML = "<p>Loading...</p>";
}

function hideLoading() {
  // Optional: nothing here, as loading is replaced during rendering
}

function showError(message) {
  document.getElementById("app").innerHTML = `<p style="color:red;">${message}</p>`;
}
