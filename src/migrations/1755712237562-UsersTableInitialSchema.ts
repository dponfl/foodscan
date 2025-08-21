import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersTableInitialSchema1755712237562 implements MigrationInterface {
    name = 'UsersTableInitialSchema1755712237562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`clientId\` int NOT NULL, \`userName\` varchar(255) NULL, \`userNick\` varchar(255) NULL, \`lang\` varchar(255) NOT NULL DEFAULT 'ru', \`freeChecks\` int NOT NULL DEFAULT '3', \`paidChecks\` int NOT NULL DEFAULT '0', \`subscriptionUntil\` timestamp NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6c3a73bbc9d8a8082816adc870\` (\`clientId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6c3a73bbc9d8a8082816adc870\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
