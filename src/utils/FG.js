export const replaceTemplate = (template, variables) => {
  return Object.keys(variables).reduce((template, key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    return template.replace(regex, variables[key]);
  }, template);
};
