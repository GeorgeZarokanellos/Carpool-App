module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "standard-with-typescript",
        "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        // Add your custom rules here
    },
    "overrides": [
        {
            "files": [".eslintrc.js"],
            "parser": "@typescript-eslint/parser",
            "parserOptions": {
                "sourceType": "script",
                "project": "/home/george/Desktop/thesis/backend/tsconfig.json"
            }
        }
    ]
}