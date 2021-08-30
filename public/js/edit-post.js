async function editFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="title"]').value.trim();
    const post_content = document.querySelector('input[name="post_content"]').value.trim();
    console.log(title);
    console.log(content);

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1

    ];

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id,
            title,
            post_content
        }),

        headers: {
            'Content-Type': 'application/json'
        }
    });


    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }

}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);