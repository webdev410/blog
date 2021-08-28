//save comment from form

const commentFormHandler = async (event) => {
	event.preventDefault();

	const comment = document.querySelector("#comment").value.trim();
	const response = await fetch("/api/post/comment", {
		method: "POST",
		body: JSON.stringify({ comment }),
		headers: { "Content-Type": "application/json" },
	});

	if (response.ok) {
		location.reload();
	} else {
		alert("Failed to post comment.");
	}
};

// event listeners
document
	.querySelector(".comment-form")
	.addEventListener("submit", commentFormHandler);
