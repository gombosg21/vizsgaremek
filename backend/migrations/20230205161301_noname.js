const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn(gender) => "users"
 * addColumn(profile_picture) => "users"
 *
 */

const info = {
  revision: 2,
  name: "noname",
  created: "2023-02-05T16:13:01.097Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "users",
      "gender",
      { type: Sequelize.INTEGER, field: "gender", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "users",
      "profile_picture",
      {
        type: Sequelize.INTEGER,
        field: "profile_picture",
        references: { model: "media", key: "ID" },
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["users", "gender", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["users", "profile_picture", { transaction }],
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
