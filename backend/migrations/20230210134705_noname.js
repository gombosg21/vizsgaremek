const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(tag_name) => "media_taglists"
 * removeColumn(tag) => "media_taglists"
 * removeColumn(createdAt) => "tags"
 * removeColumn(tag) => "tags"
 * addColumn(tag_ID) => "media_taglists"
 * addColumn(tagID) => "media_taglists"
 * addColumn(ID) => "tags"
 * addColumn(deletedAt) => "tags"
 * changeColumn(name) => "tags"
 *
 */

const info = {
  revision: 3,
  name: "noname",
  created: "2023-02-10T13:47:05.722Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["media_taglists", "tag_name", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["media_taglists", "tag", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["tags", "createdAt", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["tags", "tag", { transaction }],
  },
  {
    fn: "addColumn",
    params: [
      "media_taglists",
      "tag_ID",
      {
        type: Sequelize.INTEGER,
        field: "tag_ID",
        references: { model: "tag", key: "ID" },
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "media_taglists",
      "tagID",
      {
        type: Sequelize.INTEGER,
        field: "tagID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "tags", key: "ID" },
        primaryKey: true,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "tags",
      "ID",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "media_taglists", key: "tag_ID" },
        field: "ID",
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "tags",
      "deletedAt",
      {
        type: Sequelize.DATE,
        field: "deletedAt",
        defaultValue: null,
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "tags",
      "name",
      { type: Sequelize.STRING, field: "name", allowNull: false, unique: true },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["media_taglists", "tag_ID", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["media_taglists", "tagID", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["tags", "ID", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["tags", "deletedAt", { transaction }],
  },
  {
    fn: "addColumn",
    params: [
      "media_taglists",
      "tag_name",
      {
        type: Sequelize.STRING,
        field: "tag_name",
        references: { model: "tag", key: "name" },
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "media_taglists",
      "tag",
      {
        type: Sequelize.STRING,
        field: "tag",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "tags", key: "name" },
        primaryKey: true,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "tags",
      "createdAt",
      { type: Sequelize.DATE, field: "createdAt", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "tags",
      "tag",
      {
        type: Sequelize.STRING,
        field: "tag",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "media_taglists", key: "tag_name" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "tags",
      "name",
      {
        type: Sequelize.STRING,
        field: "name",
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      { transaction },
    ],
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
