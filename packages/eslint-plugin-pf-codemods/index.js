// if you want your rule to only run when explicitly called for using the --only flag, add the rule name to the below array
const betaRuleNames = [];

// if you want a rule to have a severity that defaults to warning rather than error, add the rule name to the below array
const warningRules = [
  "aboutModalBoxHero-remove-subcomponent",
  "applicationLauncher-warn-input",
  "card-deprecate-props",
  "card-warn-component",
  "charts-warn-tooltip",
  "conditional-aria",
  "datePicker-warn-appendTo-default-value-changed",
  "datepicker-warn-helperText",
  "deprecatedSelect-warn-markupUpdated",
  "emptyState-warn-change-structure",
  "formControls-updated-markup",
  "horizontalSubnav-warn-ariaLabel",
  "label-warn-truncated-default",
  "nav-warn-flyouts-now-inline",
  "overflowMenu-warn-updated-dropdownItem",
  "popover-warn-appendTo-default",
  "react-dropzone-warn-upgrade",
  "table-warn-actionsColumn",
  "table-warn-thExpandType",
  "tabs-warn-children-type-changed",
  "tooltip-warn-triggerRef-may-be-required",
  "wizard-warn-button-order",
];

// rules that will run before other rules (move to deprecated?)
const setupRules = [
  "applicationLauncher-deprecated",
  "contextSelector-update-deprecatedPath",
  "dropdown-update-deprecatedPath",
  "datalist-remove-selectableRow",
  "optionsMenu-deprecated",
  "pageHeader-deprecated",
  "select-deprecated",
  "table-update-deprecatedPath",
  "wizard-update-deprecatedPath",
];

// rules that will run after other rules (cleanup imports?)
const cleanupRules = ["no-unused-imports-v5"];

const createListOfRules = (version, includeBeta = false) => {
  const rules = {};
  require("glob")
    .sync(
      require
        .resolve("@patternfly/eslint-plugin-pf-codemods")
        .replace("index.js", `lib/rules/v${version}/*.js`)
    )
    .forEach(function (file) {
      const ruleName = /.*\/([^.]+)/.exec(file)[1];
      const isBeta = betaRuleNames.includes(ruleName);

      if (includeBeta === isBeta) {
        rules[ruleName] = require(`./lib/rules/v${version}/${ruleName}`);
      }
    });
  return rules;
};

const v5rules = createListOfRules("5");
const v4rules = createListOfRules("4");
const betaV5Rules = createListOfRules("5", true);

const createRules = (rules) => {
  return Object.keys(rules).reduce((acc, rule) => {
    const severity = warningRules.includes(rule) ? "warn" : "error";
    acc[`@patternfly/pf-codemods/${rule}`] = severity;
    return acc;
  }, {});
};

const mappedRules = { ...createRules(v5rules), ...createRules(v4rules) };

module.exports = {
  configs: {
    recommended: {
      plugins: ["@patternfly/pf-codemods"],
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      noInlineConfig: true,
      reportUnusedDisableDirectives: false,
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: mappedRules,
    },
  },
  rules: { ...v5rules, ...v4rules, ...betaV5Rules },
  ruleVersionMapping: { v4: Object.keys(v4rules), v5: Object.keys(v5rules) },
  setupRules,
  cleanupRules,
};
