
    const cloudbase = require('@cloudbase/node-sdk');

    const app = cloudbase.init({
      env: cloudbase.SYMBOL_CURRENT_ENV,
    });

    exports.models = app.models;
  