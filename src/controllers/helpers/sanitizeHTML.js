// 3rd Party Modules
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

module.exports.sanitizeHTML = (content) => {
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);

  const cleanHTML = DOMPurify.sanitize(content);
  return cleanHTML;
};