const fs = require('fs');

const filePath = process.argv.slice(2)[0];
const template = require(filePath);

Object.keys(template.plugins).forEach(pluginKey => {
  const plugin = template.plugins[pluginKey];
  const entries = plugin.template.properties;

  Object.keys(entries).forEach(entryKey => {
    const entry = entries[entryKey];
    let properties;

    if (entry.dataSchema.items) {
      properties = entry.dataSchema.items.properties;
    } else {
      properties = entry.dataSchema.properties;
      entry.value = entry.value || { };
    }

    if (properties) {
      Object.keys(properties).forEach(fieldKey => {
        if (properties[fieldKey].default) {
          // remove default values for arrays
          if (entry.value) {
            entry.value[fieldKey] = properties[fieldKey].default;
          }
          delete properties[fieldKey].default;
        }
      });
    }
  });
});

fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
