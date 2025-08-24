import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUsersTableAndPaymentsTable1755884824914 implements MigrationInterface {
    name = 'InitUsersTableAndPaymentsTable1755884824914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` varchar(36) NOT NULL, \`subsCategory\` varchar(255) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`currency\` varchar(3) NOT NULL, \`status\` varchar(255) NOT NULL, \`data\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`client_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`clientId\` int NOT NULL, \`userName\` varchar(255) NULL, \`userNick\` varchar(255) NULL, \`lang\` varchar(255) NOT NULL DEFAULT 'ru', \`freeChecks\` int NOT NULL DEFAULT '3', \`paidChecks\` int NOT NULL DEFAULT '0', \`subscriptionUntil\` timestamp NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6c3a73bbc9d8a8082816adc870\` (\`clientId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_bce3f30c3460065a6aeca163258\` FOREIGN KEY (\`client_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_bce3f30c3460065a6aeca163258\``);
        await queryRunner.query(`DROP INDEX \`IDX_6c3a73bbc9d8a8082816adc870\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
    }

}
