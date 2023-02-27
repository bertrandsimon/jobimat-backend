//Check if body if empty or not
function checkBody(body, keys) {
  let isValid = true;

  for (const field of keys) {
    if (!body[field] || body[field] === "") {
      isValid = false;
    }
  }
  return isValid;
}
//test error commit
module.exports = { checkBody };
