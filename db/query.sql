SELECT
    *
FROM
    comments;

SELECT
    *
FROM
    posts;

SELECT
    *
FROM
    users;

SELECT
    `post`.`id`,
    `post`.`title`,
    `post`.`text`,
    `post`.`createdAt`,
    `post`.`user_id`,
    `user`.`username` AS `user.username`,
    `user`.`email` AS `user.email`,
    `user`.`id` AS `user.id`,
    `comments`.`comment` AS `comments.comment`,
    `comments`.`user_id` AS `comments.user_id`,
    `comments`.`id` AS `comments.id`
FROM
    `posts` AS `post`
    LEFT OUTER JOIN `users` AS `user` ON `post`.`user_id` = `user`.`id`
    LEFT OUTER JOIN `comments` AS `comments` ON `post`.`id` = `comments`.`post_id`
WHERE
    `post`.`id` = '1';

SELECT
    `post`.`id`,
    `post`.`title`,
    `post`.`text`,
    `post`.`createdAt`,
    `post`.`user_id`,
    `user`.`id` AS `user.id`,
    `user`.`username` AS `user.username`,
    `user`.`email` AS `user.email`,
    `comments`.`id` AS `comments.id`,
    `comments`.`comment` AS `comments.comment`,
    `comments`.`post_id` AS `comments.post_id`,
    `comments`.`user_id` AS `comments.user_id`
FROM
    `posts` AS `post`
    LEFT OUTER JOIN `users` AS `user` ON `post`.`user_id` = `user`.`id`
    LEFT OUTER JOIN `comments` AS `comments` ON `post`.`id` = `comments`.`post_id`
WHERE
    `post`.`id` = '1';