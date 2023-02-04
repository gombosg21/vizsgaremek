const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "tags", deps: []
 * createTable() => "users", deps: []
 * createTable() => "media", deps: [user, users]
 * createTable() => "threads", deps: [media, user, media, users]
 * createTable() => "media_taglists", deps: [tag, media, media, tags]
 * createTable() => "comments", deps: [thread, user, threads, users]
 *
 */

const info = {
  revision: 1,
  name: "noname",
  created: "2023-02-04T18:15:46.337Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "tags",
      {
        name: {
          type: Sequelize.STRING,
          field: "name",
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users",
      {
        ID: {
          type: Sequelize.INTEGER,
          field: "ID",
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          field: "name",
          unique: true,
          allowNull: false,
        },
        deleted: {
          type: Sequelize.BOOLEAN,
          field: "deleted",
          defaultValue: false,
          allowNull: false,
        },
        banned: {
          type: Sequelize.BOOLEAN,
          field: "banned",
          defaultValue: false,
          allowNull: false,
        },
        type: {
          type: Sequelize.INTEGER,
          field: "type",
          defaultValue: 0,
          allowNull: false,
        },
        register_date: {
          type: Sequelize.DATE,
          field: "register_date",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        email_verified: {
          type: Sequelize.BOOLEAN,
          field: "email_verified",
          defaultValue: false,
          allowNull: false,
        },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        last_online: {
          type: Sequelize.DATE,
          field: "last_online",
          allowNull: false,
        },
        birth_date: {
          type: Sequelize.DATEONLY,
          field: "birth_date",
          allowNull: false,
        },
        profile_description: {
          type: Sequelize.TEXT,
          field: "profile_description",
        },
        profile_visibility: {
          type: Sequelize.INTEGER,
          field: "profile_visibility",
          defaultValue: 0,
          allowNull: false,
        },
        deletedAt: { type: Sequelize.DATE, field: "deletedAt" },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "media",
      {
        ID: {
          type: Sequelize.INTEGER,
          field: "ID",
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        user_ID: {
          type: Sequelize.INTEGER,
          field: "user_ID",
          references: { model: "user", key: "ID" },
          allowNull: false,
        },
        data: { type: Sequelize.BLOB, field: "data", allowNull: false },
        deleted: {
          type: Sequelize.BOOLEAN,
          field: "deleted",
          defaultValue: false,
          allowNull: false,
        },
        uploaded: {
          type: Sequelize.DATE,
          field: "uploaded",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        last_edit: {
          type: Sequelize.DATE,
          field: "last_edit",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        descption: { type: Sequelize.TEXT, field: "descption" },
        visibility: {
          type: Sequelize.INTEGER,
          field: "visibility",
          defaultValue: 0,
          allowNull: false,
        },
        placeholder_text: {
          type: Sequelize.TEXT,
          field: "placeholder_text",
          allowNull: false,
        },
        deletedAt: { type: Sequelize.DATE, field: "deletedAt" },
        userID: {
          type: Sequelize.INTEGER,
          field: "userID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "ID" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "threads",
      {
        ID: {
          type: Sequelize.INTEGER,
          field: "ID",
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        media_ID: {
          type: Sequelize.INTEGER,
          field: "media_ID",
          references: { model: "media", key: "ID" },
          allowNull: false,
        },
        user_ID: {
          type: Sequelize.INTEGER,
          field: "user_ID",
          references: { model: "user", key: "ID" },
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        status: {
          type: Sequelize.INTEGER,
          field: "status",
          defaultValue: 0,
          allowNull: false,
        },
        deleted: {
          type: Sequelize.BOOLEAN,
          field: "deleted",
          defaultValue: false,
          allowNull: false,
        },
        created: {
          type: Sequelize.DATE,
          field: "created",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        last_activity: {
          type: Sequelize.DATE,
          field: "last_activity",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        deletedAt: { type: Sequelize.DATE, field: "deletedAt" },
        mediumID: {
          type: Sequelize.INTEGER,
          field: "mediumID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "media", key: "ID" },
          allowNull: true,
        },
        userID: {
          type: Sequelize.INTEGER,
          field: "userID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "ID" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "media_taglists",
      {
        tag_name: {
          type: Sequelize.STRING,
          field: "tag_name",
          references: { model: "tag", key: "name" },
          allowNull: false,
        },
        media_ID: {
          type: Sequelize.INTEGER,
          field: "media_ID",
          references: { model: "media", key: "ID" },
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        mediumID: {
          type: Sequelize.INTEGER,
          field: "mediumID",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "media", key: "ID" },
          primaryKey: true,
        },
        tagName: {
          type: Sequelize.STRING,
          field: "tagName",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "tags", key: "name" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "comments",
      {
        ID: {
          type: Sequelize.INTEGER,
          field: "ID",
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        thread_ID: {
          type: Sequelize.INTEGER,
          field: "thread_ID",
          references: { model: "thread", key: "ID" },
          allowNull: false,
        },
        user_ID: {
          type: Sequelize.INTEGER,
          field: "user_ID",
          references: { model: "user", key: "ID" },
          allowNull: false,
        },
        content: { type: Sequelize.TEXT, field: "content", allowNull: false },
        deleted: {
          type: Sequelize.BOOLEAN,
          field: "deleted",
          defaultValue: false,
          allowNull: false,
        },
        created: {
          type: Sequelize.DATE,
          field: "created",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        last_edit: {
          type: Sequelize.DATE,
          field: "last_edit",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        deletedAt: { type: Sequelize.DATE, field: "deletedAt" },
        threadID: {
          type: Sequelize.INTEGER,
          field: "threadID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "threads", key: "ID" },
          allowNull: true,
        },
        userID: {
          type: Sequelize.INTEGER,
          field: "userID",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "ID" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["comments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["media", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["media_taglists", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["tags", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["threads", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
