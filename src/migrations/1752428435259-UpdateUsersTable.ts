import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersTable1752428435259 implements MigrationInterface {
    name = 'UpdateUsersTable1752428435259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_df18d17f84763558ac84192c75\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`telegramId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`clientId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_6c3a73bbc9d8a8082816adc870\` (\`clientId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`userName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`userNick\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lang\` varchar(255) NOT NULL DEFAULT 'ru'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lang\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`userNick\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`userName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_6c3a73bbc9d8a8082816adc870\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`username\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`telegramId\` int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_df18d17f84763558ac84192c75\` ON \`users\` (\`telegramId\`)`);
    }

}
