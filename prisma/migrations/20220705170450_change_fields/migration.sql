-- AlterTable
ALTER TABLE `Account` MODIFY `refresh_token` TEXT NULL,
    MODIFY `access_token` TEXT NULL,
    MODIFY `id_token` TEXT NULL,
    MODIFY `oauth_token` TEXT NULL,
    MODIFY `oauth_token_secret` TEXT NULL;
