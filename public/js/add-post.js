async function newFormHandler(event) {
	event.preventDefault();

	const title = document.querySelector('input[name="title"]').value;
	const post_content = document.querySelector('input[name="post_content"]').value;

	const response = await fetch(`/api/posts`, {
		method: "POST",
		body: JSON.stringify({
			title,
			post_content,
		}),
		headers: {
			"post_content-Type": "application/json",
		},
	});

	if (response.ok) {
		document.location.replace("/dashboard");
	} else {
		alert(response.statusText);
	}
}

document
	.querySelector(".new-post-form")
	.addEventListener("submit", newFormHandler);
