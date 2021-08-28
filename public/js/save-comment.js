//save comment from form

const commentFormHandler = async (event) => {
	event.preventDefault();

	const comment_body = document.querySelector("#comment_body").value.trim();
	const post_id = window.location.toString().split("/")[
		window.location.toString().split("/").length - 1
	];

	const response = await fetch("/api/comment", {
		method: "POST",
		body: JSON.stringify({ comment_body, post_id }),
		headers: { "Content-Type": "application/json" },
	});

	if (response.ok) {
		alert(`Comment Added`);
		document.location.reload();
	} else {
		alert("Failed to post comment... sorry.");
	}
};

// event listeners
document
	.querySelector(".comment-form")
	.addEventListener("submit", commentFormHandler);
