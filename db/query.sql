SELECT
    `post`.`id`,
    `post`.`post_title`,
    `post`.`post_body`,
    `post`.`user_id`,
    `post`.`createdAt`,
    `user`.`id` AS `user.id`,
    `user`.`username` AS `user.username`,
    `user`.`email` AS `user.email`,
    `user->comments`.`id` AS `user.comments.id`,
    `user->comments`.`comment_body` AS `user.comments.comment_body`,
    `user->comments`.`post_id` AS `user.comments.post_id`,
    `user->comments`.`user_id` AS `user.comments.user_id`
FROM
    `posts` AS `post`
    LEFT OUTER JOIN `users` AS `user` ON `post`.`user_id` = `user`.`id`
    LEFT OUTER JOIN `comments` AS `user->comments` ON `user`.`id` = `user->comments`.`user_id`
WHERE
    `post`.`id` = '1';