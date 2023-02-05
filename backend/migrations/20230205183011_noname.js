const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(deletedAt) => "comments"
 * changeColumn(deletedAt) => "media"
 * changeColumn(deletedAt) => "threads"
 * changeColumn(deletedAt) => "users"
 *
 */

const info = {
  revision: 3,
  name: "noname",
  created: "2023-02-05T18:30:11.218Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "comments",
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
    fn: "addColumn",
    params: [
      "media",
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
    fn: "addColumn",
    params: [
      "threads",
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
    fn: "addColumn",
    params: [
      "users",
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
];

const rollbackCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "comments",
      "deletedAt",
      { type: Sequelize.DATE, field: "deletedAt" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "media",
      "deletedAt",
      { type: Sequelize.DATE, field: "deletedAt" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "threads",
      "deletedAt",
      { type: Sequelize.DATE, field: "deletedAt" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "users",
      "deletedAt",
      { type: Sequelize.DATE, field: "deletedAt" },
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
